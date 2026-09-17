import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Lazy-initialize Google GenAI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set.');
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'عزم - PWA',
    timestamp: new Date().toISOString(),
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Logo direct upload endpoint
app.post('/api/upload-logo', (req, res) => {
  try {
    const { dataUrl } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'No image data provided' });
    }
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid data URL format' });
    }
    const buffer = Buffer.from(matches[2], 'base64');
    const publicPath = path.join(process.cwd(), 'public');
    fs.writeFileSync(path.join(publicPath, 'azm real logo.jpeg'), buffer);
    fs.writeFileSync(path.join(publicPath, 'azm-real-logo.jpeg'), buffer);
    fs.writeFileSync(path.join(publicPath, 'azm-logo.png'), buffer);
    fs.writeFileSync(path.join(publicPath, 'azm-real-logo.png'), buffer);
    return res.json({ success: true, message: 'Logo saved successfully' });
  } catch (err: any) {
    console.error('Failed to save logo:', err);
    return res.status(500).json({ error: err.message });
  }
});



// 2. AI Routine Generator (Natural language prompt -> Structured JSON Routine)
app.post('/api/gemini/generate-routine', async (req, res) => {
  try {
    const { prompt, weight_kg, days_per_week, user_level, equipment } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'يرجى تقديم وصف صالح للجدول التدريبي المطلوب.' });
    }

    const equipmentDesc = Array.isArray(equipment) && equipment.length > 0
      ? equipment.join('، ')
      : 'نادي متكامل (Full Gym)';

    const ai = getGeminiClient();
    if (!ai) {
      // Offline / Key fallback: Return high-quality structured default routine matching the prompt & equipment
      const isDumbbellOnly = Array.isArray(equipment) && equipment.includes('dumbbells') && !equipment.includes('barbell') && !equipment.includes('full_gym');

      return res.json({
        routine_title: isDumbbellOnly ? 'جدول عزم بالدامبلز فقط' : 'جدول عزم المخصص',
        target_goal: prompt.slice(0, 50),
        days: [
          {
            day_name: 'اليوم الأول: الجزء العلوي',
            exercises: isDumbbellOnly
              ? [
                  { name: 'بنش برس بالدامبلز مستوي', sets: 4, reps: '8-10', tips: 'النزول ببطء وعصر عضلات الصدر' },
                  { name: 'تجديف دامبل بيد واحدة (One-arm Row)', sets: 4, reps: '10-12', tips: 'سحب الكوع باتجاه الحوض' },
                  { name: 'ضغط أكتاف جالس بالدامبلز', sets: 3, reps: '10', tips: 'الحفاظ على استقامة العمود الفقري' },
                  { name: 'مرجحة بايسبس بالدامبلز مطرقة (Hammer)', sets: 3, reps: '12', tips: 'ثبات الكوعين بدون تأرجح' },
                ]
              : [
                  { name: 'بنش برس مستوي بالبار', sets: 4, reps: '8-10', tips: 'النزول ببطء ولمس الصدر برفق' },
                  { name: 'سحب علوي عريض (لات بول داون)', sets: 4, reps: '10-12', tips: 'إرجاع الكتفين وعصر الظهر' },
                  { name: 'ضغط أكتاف جالس بالدامبلز', sets: 3, reps: '10', tips: 'الحفاظ على استقامة العمود الفقري' },
                  { name: 'مرجحة بايسبس بالبار', sets: 3, reps: '12', tips: 'ثبات الكوعين بدون تأرجح' },
                ],
          },
          {
            day_name: 'اليوم الثاني: الجزء السفلي والكور',
            exercises: isDumbbellOnly
              ? [
                  { name: 'سكوات كأس بالدامبل (Goblet Squat)', sets: 4, reps: '10-12', tips: 'الحفاظ على الدامبل ملاصق للصدر' },
                  { name: 'ديدليفت روماني بالدامبلز (RDL)', sets: 3, reps: '10-12', tips: 'إرجاع الحوض والشعور بتمدد الأوتار' },
                  { name: 'لانجز بالدامبلز خطوة للأمام', sets: 3, reps: '10 لكل رجل', tips: 'تثبيت الركبة الأمامية' },
                  { name: 'تمرين الثبات (بلانك)', sets: 3, reps: '45 ثانية', tips: 'شد عضلات البطن والمؤخرة' },
                ]
              : [
                  { name: 'سكوات خلفي بالبار', sets: 4, reps: '6-8', tips: 'دفع الركبتين للخارج والحفاظ على الصدر مرفوعاً' },
                  { name: 'ديدليفت روماني (RDL)', sets: 3, reps: '8-10', tips: 'التركيز على إرجاع الحوض وتمدد الأوتار' },
                  { name: 'دفع الأرجل بالجهاز 45°', sets: 3, reps: '12', tips: 'تجنب قفل الركبة في الأعلى' },
                  { name: 'تمرين الثبات (بلانك)', sets: 3, reps: '45 ثانية', tips: 'شد عضلات البطن والمؤخرة' },
                ],
          },
        ],
        fallback: true,
      });
    }

    const systemInstruction = `أنت مدرب لياقة وخبير تدريب مقاومة رياضي محترف في تطبيق "عزم" (Azm).
مهمتك بناء خطة تمرين أسبوعية منظمة تماماً ومفصلة باللغة العربية بناءً على طلب المتدرب.
القواعد الصارمة:
1. ارجع فقط كائن JSON متوافق مع المخطط.
2. التزم حصراً بالمعدات المتوفرة للمتدرب: (${equipmentDesc}). لا تقترح أجهزة أو كابلات إذا لم تكن متوفرة!
3. أسماء التمارين واضحة ومشهورة في الجيم العربي (مع ذكر الأسلوب).
4. وزع الأيام بشكل متوازن يراعي الاستشفاء وتفادي الإصابات.
5. اذكر عدد المجموعات (sets بين 3 و 5) والتكرارات (reps مثل '8-10' أو '12-15') ونصيحة تكنيك مختصرة لكل تمرين (tips).`;

    const userPrompt = `طلب المتدرب: "${prompt}"
المعدات المتاحة للمتدرب: ${equipmentDesc}
وزن المتدرب: ${weight_kg ? `${weight_kg} كغ` : 'غير محدد'}
عدد الأيام المفضل: ${days_per_week || 'غير محدد'}
مستوى المتدرب: ${user_level || 'متوسط'}

قم بإنشاء جدول تمارين متكامل يلبي هذا الهدف بدقة ويحمي المفاصل ويزيد القوة والعزم مع التقيد بالمعدات المتاحة.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            routine_title: { type: Type.STRING, description: 'عنوان جذاب للجدول باللغة العربية' },
            target_goal: { type: Type.STRING, description: 'الهدف الرياضي الرئيسي للجدول' },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day_name: { type: Type.STRING, description: 'اسم اليوم وعضلات التركيز' },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING, description: 'اسم التمرين بالعربية' },
                        sets: { type: Type.INTEGER, description: 'عدد الجولات (3-5)' },
                        reps: { type: Type.STRING, description: 'نطاق التكرار مثل 8-10' },
                        tips: { type: Type.STRING, description: 'نصيحة أداء وتكنيك موجزة' },
                      },
                      required: ['name', 'sets', 'reps', 'tips'],
                    },
                  },
                },
                required: ['day_name', 'exercises'],
              },
            },
          },
          required: ['routine_title', 'target_goal', 'days'],
        },
      },
    });

    const outputText = response.text?.trim() || '{}';
    const parsedData = JSON.parse(outputText);
    return res.json(parsedData);
  } catch (err: unknown) {
    console.error('Error generating AI routine:', err);
    return res.status(500).json({
      error: 'تعذر توليد الجدول بواسطة الذكاء الاصطناعي حالياً. يرجى المحاولة لاحقاً.',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

// 3. AI Weekly Performance & Recovery Recap
app.post('/api/gemini/weekly-recap', async (req, res) => {
  try {
    const { total_workouts, total_volume_kg, avg_water_ml, pr_list, streak_days, weight_kg } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        headline: 'أسبوع مليء بالعزم والإنجاز!',
        summary: `أتممت ${total_workouts || 0} جلسة تدريبية بحجم أوزان يقارب ${total_volume_kg || 0} كغ، ومعدل شرب ماء ${avg_water_ml || 2500} مل يومياً.`,
        streak_feedback: `متتالية عزمك مستمرة لـ ${streak_days || 1} يوماً متتالياً! الاستمرارية هي مفتاح التطور.`,
        hydration_analysis: 'مستوى الارتواء جيد ويدعم امتصاص الكرياتين وسرعة الاستشفاء العضلي.',
        strength_progress: pr_list?.length ? `حققت ${pr_list.length} رقماً قياسياً جديداً (PR) هذا الأسبوع!` : 'أوزانك في منحنى تصاعدي متزن مع تركيز ممتاز على التكنيك.',
        recovery_recommendations: [
          'الحرص على النوم العميق لمدة 7-8 ساعات لإعادة بناء الألياف العضلية.',
          'شرب 500 مل ماء فور الاستيقاظ لإنعاش الجهاز العصبي والمفاصل.',
          'إجراء إطالات ساكنة خفيفة للمجموعات العضلية الأكثر إجهاداً.',
        ],
        motivational_quote: '«القوة لا تأتي من ما تستطيع فعله، بل من التغلب على ما ظننت أنك عاجز عنه.»',
        fallback: true,
      });
    }

    const prompt = `بيانات الأسبوع للمتدرب في تطبيق "عزم":
- عدد التمارين المنجزة: ${total_workouts || 0}
- إجمالي حجم الأوزان المرفوعة (Volume): ${total_volume_kg || 0} كغ
- متوسط شرب الماء اليومي: ${avg_water_ml || 0} مل
- أرقام قياسية محققة (PRs): ${JSON.stringify(pr_list || [])}
- عدد أيام الالتزام المتتالية (Streak): ${streak_days || 0} يوم
- وزن المتدرب: ${weight_kg || 75} كغ

حلل هذا الأداء وقدم تلخيصاً أسبوعياً محفزاً ومبنياً على الأدلة الرياضية باللغة العربية.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'أنت المدرب ومساعد الاستشفاء الذكي "عزم". قدم تحليلاً واقعياً وملهماً لأداء المتدرب مع نصائح استشفاء عملية.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: 'عنوان مشجع للأسبوع' },
            summary: { type: Type.STRING, description: 'موجز رقمي تحليلي للأسبوع' },
            streak_feedback: { type: Type.STRING, description: 'تعليق على الاستمرارية والعزم' },
            hydration_analysis: { type: Type.STRING, description: 'تقييم الارتواء وتأثيره على الأداء' },
            strength_progress: { type: Type.STRING, description: 'تقييم تطور القوة والأرقام القياسية' },
            recovery_recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 نصائح استشفاء حاسمة للأسبوع القادم',
            },
            motivational_quote: { type: Type.STRING, description: 'عبارة تحفيزية ختامية قوية' },
          },
          required: [
            'headline',
            'summary',
            'streak_feedback',
            'hydration_analysis',
            'strength_progress',
            'recovery_recommendations',
            'motivational_quote',
          ],
        },
      },
    });

    const outputText = response.text?.trim() || '{}';
    const parsed = JSON.parse(outputText);
    return res.json(parsed);
  } catch (err: unknown) {
    console.error('Error generating AI weekly recap:', err);
    return res.status(500).json({
      error: 'تعذر إنشاء التقرير الأسبوعي حالياً.',
      details: err instanceof Error ? err.message : String(err),
    });
  }
});

// Vite middleware for dev or static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Azm Fitness Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

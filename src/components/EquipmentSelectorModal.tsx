import React from 'react';
import { EquipmentType } from '../types';
import { Dumbbell, Shield, Check, Sparkles } from 'lucide-react';

export interface EquipmentOption {
  id: EquipmentType;
  title_ar: string;
  title_en: string;
  description_ar: string;
}

export const EQUIPMENT_OPTIONS: EquipmentOption[] = [
  {
    id: 'full_gym',
    title_ar: 'جيم متكامل (Full Gym)',
    title_en: 'Full Gym',
    description_ar: 'صالة رياضية مزودة بكافة الأوزان الحرة والأجهزة الحديثة',
  },
  {
    id: 'dumbbells',
    title_ar: 'دامبلز (Dumbbells)',
    title_en: 'Dumbbells',
    description_ar: 'أوزان يد حرة بمختلف المقاسات أو قابلة للتعديل',
  },
  {
    id: 'barbell',
    title_ar: 'بار أولمبي وأوزان (Barbell)',
    title_en: 'Barbell & Plates',
    description_ar: 'بار حديدي مع طارات أوزان مستقيمة وراك تدريب',
  },
  {
    id: 'machines',
    title_ar: 'أجهزة الجيم (Gym Machines)',
    title_en: 'Machines',
    description_ar: 'أجهزة العزل الميكانيكية مثل مكبس الأرجل وجهاز الصدر',
  },
  {
    id: 'cable',
    title_ar: 'جهاز الكيبل (Cable Machine)',
    title_en: 'Cable Machine',
    description_ar: 'بكرات كيبل قابلة لتعديل الارتفاع مع قبضات وحبال',
  },
  {
    id: 'bands',
    title_ar: 'حبال مقاومة مطاطية (Resistance Bands)',
    title_en: 'Resistance Bands',
    description_ar: 'أحزمة مطاطية لتمارين المقاومة والتحمية والإطالة',
  },
  {
    id: 'kettlebell',
    title_ar: 'كيتل بيل (Kettlebell)',
    title_en: 'Kettlebell',
    description_ar: 'أوزان حديدية بمقبض للتمارين الديناميكية وقوة القبضة',
  },
  {
    id: 'pullup_bar',
    title_ar: 'عقلة ومتوازي (Pull-up Bar & Dips)',
    title_en: 'Pull-up Bar & Dips',
    description_ar: 'بار عقلة منزلي أو جهاز متوازي للجزء العلوي',
  },
  {
    id: 'bodyweight',
    title_ar: 'وزن الجسم فقط (Bodyweight Only)',
    title_en: 'Bodyweight Only',
    description_ar: 'بدون أي أدوات خارجية - الاعتماد على وزن الجسم والكاليسثنكس',
  },
];

interface EquipmentSelectorProps {
  selectedEquipment: EquipmentType[];
  onChange: (equipment: EquipmentType[]) => void;
  title?: string;
  subtitle?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  selectedEquipment = [],
  onChange,
  title = 'شو متوفر عندك للتمرين؟',
  subtitle = 'حدد كل الأدوات المتوفرة لديك وسيقوم "عزم" بفلترة التمارين واقتراح الجداول المناسبة تماماً لمعداتك.',
  isModal = false,
  onClose,
}) => {
  const toggleEquipment = (id: EquipmentType) => {
    // If selecting 'bodyweight', handle exclusive logic or multi-select
    if (id === 'bodyweight') {
      if (selectedEquipment.includes('bodyweight')) {
        onChange(selectedEquipment.filter((item) => item !== 'bodyweight'));
      } else {
        onChange(['bodyweight']);
      }
      return;
    }

    // If selecting other equipment, remove 'bodyweight' if it was solely selected
    const withoutBodyweight = selectedEquipment.filter((item) => item !== 'bodyweight');
    if (withoutBodyweight.includes(id)) {
      const next = withoutBodyweight.filter((item) => item !== id);
      onChange(next.length ? next : ['bodyweight']);
    } else {
      onChange([...withoutBodyweight, id]);
    }
  };

  const content = (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-black text-[#F4F5F3] flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-[#6BAF8F]" />
          <span>{title}</span>
        </h3>
        <p className="text-xs text-[#C8E6CF]/80 leading-relaxed">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto pr-1">
        {EQUIPMENT_OPTIONS.map((opt) => {
          const isSelected = selectedEquipment.includes(opt.id);

          return (
            <div
              key={opt.id}
              onClick={() => toggleEquipment(opt.id)}
              className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between text-xs select-none active:scale-[0.98] ${
                isSelected
                  ? 'bg-[#1F3A34]/50 border-[#6BAF8F] shadow-md shadow-[#6BAF8F]/15'
                  : 'bg-[#0E1A17] border-[#1F3A34] hover:border-[#6BAF8F]/40 text-[#C8E6CF]/70'
              }`}
            >
              <div className="space-y-0.5 max-w-[85%]">
                <div className="flex items-center gap-2">
                  <h4
                    className={`font-bold text-xs ${
                      isSelected ? 'text-[#F4F5F3]' : 'text-[#C8E6CF]/90'
                    }`}
                  >
                    {opt.title_ar}
                  </h4>
                </div>
                <p className="text-[10px] text-[#C8E6CF]/60 line-clamp-1">
                  {opt.description_ar}
                </p>
              </div>

              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center transition ${
                  isSelected
                    ? 'bg-[#6BAF8F] text-[#070B0A]'
                    : 'border border-[#1F3A34] bg-[#070B0A]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {isModal && onClose && (
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#6BAF8F] hover:bg-[#6BAF8F]/90 text-[#070B0A] font-black text-xs transition shadow-lg shadow-[#6BAF8F]/20 active:scale-95"
        >
          حفظ وتطبيق التغييرات
        </button>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-[#070B0A]/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-3xl bg-[#0E1A17] border border-[#1F3A34] p-5 space-y-4 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

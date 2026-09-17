import React, { useState } from 'react';
import { UserProfile, EquipmentType } from '../types';
import { db } from '../db/dexie';
import { EquipmentSelector } from './EquipmentSelectorModal';
import { AzmLogo } from './AzmLogo';
import {
  User,
  Scale,
  Droplets,
  HardDrive,
  ShieldCheck,
  Download,
  Dumbbell,
  CheckCircle2,
} from 'lucide-react';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, onUpdateProfile }) => {
  const [name, setName] = useState(userProfile.name);
  const [weight, setWeight] = useState<string>(String(userProfile.weight_kg));
  const [equipment, setEquipment] = useState<EquipmentType[]>(
    userProfile.equipment || ['full_gym', 'dumbbells', 'barbell', 'machines', 'cable', 'pullup_bar']
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    const w = parseFloat(weight) || 75;
    const updated: UserProfile = {
      ...userProfile,
      name: name.trim() || 'البطل',
      weight_kg: w,
      daily_water_target_ml: Math.round(w * 35),
      equipment,
    };

    await db.user_profile.put(updated);
    onUpdateProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportData = async () => {
    const workouts = await db.workout_sessions.toArray();
    const water = await db.water_logs.toArray();
    const prs = await db.personal_records.toArray();
    const routines = await db.routines.toArray();
    const events = await db.calendar_events.toArray();

    const backup = {
      export_date: new Date().toISOString(),
      user: userProfile,
      workouts,
      water,
      prs,
      routines,
      events,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `azm_fitness_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div
      id="profile-view"
      className="relative isolate min-h-[calc(100vh-76px)] overflow-hidden p-4 space-y-6 max-w-xl mx-auto pb-28 text-[#F4F5F3]"
    >
      {/* Dedicated Athlete Identity & Gear Locker Background Layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        <img
          src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1600&auto=format&fit=crop"
          alt="الملف الشخصي والمعدات"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 filter contrast-125 brightness-90 opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B0A]/92 via-[#070B0A]/80 to-[#070B0A]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(107,175,143,0.15),_transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(22,46,39,0.35),_transparent_75%)]" />
      </div>

      {/* Brand & User Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1F3A34]">
        <div>
          <h2 className="text-xl font-black text-[#F4F5F3] flex items-center gap-2">
            <User className="w-5 h-5 text-[#6BAF8F]" />
            <span>الملف الشخصي والمعدات</span>
          </h2>
          <p className="text-xs text-[#C8E6CF]/70 mt-0.5">
            تخصيص الأدوات المتوفرة، قياسات الوزن، وحفظ البيانات
          </p>
        </div>
        <AzmLogo size="sm" showText={false} />
      </div>

      {/* Basic Metrics Settings Card */}
      <div className="rounded-3xl bg-[#0E1A17] border border-[#1F3A34] p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-black text-[#F4F5F3]">المعلومات الأساسية</h3>

        <div>
          <label className="text-xs font-bold text-[#C8E6CF]">الاسم أو اللقب الرياضي</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#070B0A] border border-[#1F3A34] text-xs text-[#F4F5F3] focus:outline-none focus:border-[#6BAF8F]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#C8E6CF] flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-[#6BAF8F]" />
            <span>وزن الجسم الحالي (كغ)</span>
          </label>
          <input
            type="number"
            step="0.5"
            min="30"
            max="250"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#070B0A] border border-[#1F3A34] text-xs text-[#F4F5F3] font-mono font-bold focus:outline-none focus:border-[#6BAF8F]"
          />
          <span className="text-[10px] text-[#C8E6CF]/60 block mt-1">
            يُستخدم لحساب احتياج شرب الماء اليومي ({Math.round((parseFloat(weight) || 75) * 35)} مل كحد أدنى) ونسب تمارين وزن الجسم
          </span>
        </div>
      </div>

      {/* Equipment-Based Training Section (Requirement 4) */}
      <div className="rounded-3xl bg-[#0E1A17] border border-[#1F3A34] p-5 space-y-4 shadow-xl">
        <EquipmentSelector
          selectedEquipment={equipment}
          onChange={(newEq) => setEquipment(newEq)}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3 rounded-2xl bg-[#6BAF8F] hover:bg-[#6BAF8F]/90 text-[#070B0A] font-black text-xs transition active:scale-95 shadow-lg shadow-[#6BAF8F]/20 flex items-center justify-center gap-2"
      >
        {saveSuccess ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حفظ التعديلات والمعدات بنجاح!</span>
          </>
        ) : (
          <span>حفظ الإعدادات والمعدات</span>
        )}
      </button>

      {/* Offline Storage & Privacy */}
      <div className="rounded-3xl bg-[#0E1A17]/70 border border-[#1F3A34] p-5 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-[#6BAF8F] font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>الأداء دون إنترنت (Offline-First) والخصوصية</span>
        </div>
        <p className="text-[#C8E6CF]/70 leading-relaxed text-[11px]">
          يعتمد تطبيق "عزم" بالكامل على قاعدة بيانات IndexedDB محلية على هاتفك. لا يتم إرسال أوزانك أو جدول مواعيدك لأي طرف خارجي دون إذنك، مما يمنحك سرعة فائقة داخل صالة الحديد والعمل التام دون شبكة.
        </p>

        <div className="pt-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#070B0A] hover:bg-[#1F3A34] text-[#C8E6CF] font-bold transition text-xs border border-[#1F3A34]"
          >
            <Download className="w-3.5 h-3.5 text-[#6BAF8F]" />
            <span>تصدير نسخة احتياطية لبياناتي (JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

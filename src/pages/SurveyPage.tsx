import { useState } from "react";
import {
  Star,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Send,
  Droplets,
  FlaskConical,
  TestTube,
  Leaf,
  Headphones,
  Globe,
  Smartphone,
  Building2,
  User,
  Mail,
  Phone,
  Languages,
} from "lucide-react";
import Button from "@/components/Button";
import { supabase } from "@/lib/supabaseClient";
import { LAB_INFO } from "@/config/app.config";
import { translations, type Language } from "@/lib/surveyTranslations";

interface SurveyPageProps {
  onHome: () => void;
}

const SERVICE_KEYS = [
  "Water quality testing",
  "Wastewater testing",
  "Sample collection",
  "Environmental analysis",
  "Customer support",
  "Other",
] as const;

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "Water quality testing": <Droplets size={18} />,
  "Wastewater testing": <TestTube size={18} />,
  "Sample collection": <FlaskConical size={18} />,
  "Environmental analysis": <Leaf size={18} />,
  "Customer support": <Headphones size={18} />,
  Other: <Star size={18} />,
};

const RATING_KEYS = [
  "rating_staff_professionalism",
  "rating_speed_of_service",
  "rating_ease_of_submitting_samples",
  "rating_clarity_of_reports",
  "rating_communication",
  "rating_cleanliness",
  "rating_overall_experience",
] as const;

const REFERRAL_KEYS = [
  "Website",
  "Social Media",
  "Government Agency",
  "Company",
  "Friend/Colleague",
  "Other",
] as const;

const REFERRAL_ICONS: Record<string, React.ReactNode> = {
  Website: <Globe size={18} />,
  "Social Media": <Smartphone size={18} />,
  "Government Agency": <Building2 size={18} />,
  Company: <Building2 size={18} />,
  "Friend/Colleague": <User size={18} />,
  Other: <Star size={18} />,
};

export default function SurveyPage({ onHome }: SurveyPageProps) {
  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang];
  const isRTL = lang === "ar";

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [serviceUsed, setServiceUsed] = useState("");
  const [satisfaction, setSatisfaction] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [resultsOnTime, setResultsOnTime] = useState("");
  const [reportsEasy, setReportsEasy] = useState("");
  const [npsScore, setNpsScore] = useState<number | null>(null);
  const [likedMost, setLikedMost] = useState("");
  const [improvements, setImprovements] = useState("");
  const [wantsContact, setWantsContact] = useState<string>("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [referralSource, setReferralSource] = useState("");

  const totalSteps = 4;

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const canProceedStep1 = !!serviceUsed;
  const canProceedStep2 = satisfaction > 0;
  const canProceedStep3 = !!resultsOnTime && !!reportsEasy && npsScore !== null;
  const wantsContactYes = wantsContact === "Yes";

  const BackIcon = isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const payload = {
      language: lang,
      service_used: serviceUsed || null,
      satisfaction: satisfaction || null,
      rating_staff_professionalism: ratings.rating_staff_professionalism || null,
      rating_speed_of_service: ratings.rating_speed_of_service || null,
      rating_ease_of_submitting_samples: ratings.rating_ease_of_submitting_samples || null,
      rating_clarity_of_reports: ratings.rating_clarity_of_reports || null,
      rating_communication: ratings.rating_communication || null,
      rating_cleanliness: ratings.rating_cleanliness || null,
      rating_overall_experience: ratings.rating_overall_experience || null,
      results_on_time: resultsOnTime || null,
      reports_easy_to_understand: reportsEasy || null,
      nps_score: npsScore ?? null,
      liked_most: likedMost.trim() || null,
      improvements: improvements.trim() || null,
      wants_contact: wantsContact === "Yes",
      contact_name: wantsContactYes ? contactName.trim() || null : null,
      contact_email: wantsContactYes ? contactEmail.trim() || null : null,
      contact_phone: wantsContactYes ? contactPhone.trim() || null : null,
      additional_comments: additionalComments.trim() || null,
      referral_source: referralSource || null,
    };

    const { error: insertError } = await supabase
      .from("survey_responses")
      .insert([payload]);

    setSubmitting(false);

    if (insertError) {
      setError(t.errorMsg);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            {t.thankYou}
          </h1>
          <p className="mt-3 max-w-md text-base text-slate-600 dark:text-slate-300">
            {t.thankYouMsg(LAB_INFO.name)}
          </p>
          <Button
            variant="primary"
            size="lg"
            className="mt-8"
            onClick={onHome}
            leftIcon={BackIcon}
          >
            {t.backToHome}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
    >
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* Language toggle */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <Languages size={16} className="ml-2 text-slate-400" />
            <button
              onClick={() => setLang("en")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                lang === "en"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("ar")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                lang === "ar"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              العربية
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg shadow-blue-600/20">
            <Star size={26} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            {t.surveyTitle}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {t.surveySubtitle}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            {t.takesTime}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{t.step(step, totalSteps)}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Survey card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t.q1Service}
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {SERVICE_KEYS.map((key) => (
                    <button
                      key={key}
                      onClick={() => setServiceUsed(key)}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                        serviceUsed === key
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
                          : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span className={serviceUsed === key ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}>
                        {SERVICE_ICONS[key]}
                      </span>
                      {t.services[key]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t.referralQuestion}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">{t.optional}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {REFERRAL_KEYS.map((key) => (
                    <button
                      key={key}
                      onClick={() => setReferralSource(key)}
                      className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                        referralSource === key
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
                          : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      <span className={referralSource === key ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}>
                        {REFERRAL_ICONS[key]}
                      </span>
                      {t.referralSources[key]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t.q2Satisfaction}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setSatisfaction(n)}
                      className={`flex flex-col items-center gap-1 rounded-xl border px-4 py-3 transition-all ${
                        satisfaction === n
                          ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30"
                          : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-600 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Star
                        size={24}
                        className={satisfaction >= n ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}
                      />
                      <span className={`text-xs font-medium ${satisfaction === n ? "text-blue-700 dark:text-blue-300" : "text-slate-500 dark:text-slate-400"}`}>
                        {t.satisfactionLabels[n - 1]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t.q3RateFollowing}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">{t.scalePoorExcellent}</p>
                <div className="mt-4 space-y-4">
                  {RATING_KEYS.map((key) => (
                    <div key={key} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        {t.ratingLabels[key]}
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => handleRatingChange(key, n)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                              (ratings[key] ?? 0) >= n
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-200 text-slate-400 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:text-slate-500 dark:hover:bg-slate-700"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t.q4ResultsOnTime}
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(["Yes", "No", "Partially"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setResultsOnTime(opt)}
                      className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
                        resultsOnTime === opt
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
                          : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {t.yesNoPartial[opt]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t.q5ReportsEasy}
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(["Yes", "Somewhat", "No"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setReportsEasy(opt)}
                      className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
                        reportsEasy === opt
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
                          : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {t.easyOptions[opt]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t.q6Recommend}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  0 = {t.npsNotLikely}, 10 = {t.npsExtremelyLikely}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                    <button
                      key={n}
                      onClick={() => setNpsScore(n)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                        npsScore === n
                          ? "scale-110 border-blue-600 bg-blue-600 text-white shadow-md"
                          : n <= 6
                          ? "border-slate-200 text-slate-500 hover:border-red-300 hover:bg-red-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                          : n <= 8
                          ? "border-slate-200 text-slate-500 hover:border-amber-300 hover:bg-amber-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                          : "border-slate-200 text-slate-500 hover:border-green-300 hover:bg-green-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-400 dark:text-slate-500">
                  <span>{t.npsNotLikely}</span>
                  <span>{t.npsExtremelyLikely}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t.q7LikedMost}
                </h2>
                <textarea
                  value={likedMost}
                  onChange={(e) => setLikedMost(e.target.value)}
                  rows={3}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200 dark:focus:bg-slate-700"
                  placeholder={t.likedMostPlaceholder}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t.q8Improve}
                </h2>
                <textarea
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  rows={3}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200 dark:focus:bg-slate-700"
                  placeholder={t.improvePlaceholder}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t.q9Contact}
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(["Yes", "No"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setWantsContact(opt)}
                      className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${
                        wantsContact === opt
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300"
                          : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {t.yesNo[opt]}
                    </button>
                  ))}
                </div>

                {wantsContactYes && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t.contactName}
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200 dark:focus:bg-slate-700"
                          placeholder={t.contactNamePlaceholder}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t.contactEmail}
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200 dark:focus:bg-slate-700"
                          placeholder={t.contactEmailPlaceholder}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t.contactPhone}
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200 dark:focus:bg-slate-700"
                          placeholder={t.contactPhonePlaceholder}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {t.q10Additional}
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">{t.optional}</p>
                <textarea
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  rows={3}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-200 dark:focus:bg-slate-700"
                  placeholder={t.additionalPlaceholder}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)} leftIcon={BackIcon}>
                {t.back}
              </Button>
            ) : (
              <Button variant="ghost" onClick={onHome} leftIcon={BackIcon}>
                {t.home}
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                variant="primary"
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !canProceedStep1) ||
                  (step === 2 && !canProceedStep2) ||
                  (step === 3 && !canProceedStep3)
                }
              >
                {t.next}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={submitting}
                rightIcon={!submitting ? <Send size={16} /> : undefined}
              >
                {t.submit}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

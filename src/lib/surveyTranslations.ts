export type Language = "en" | "ar";

export interface SurveyStrings {
  // Language selector
  surveyTitle: string;
  surveySubtitle: string;
  takesTime: string;

  // Progress
  step: (n: number, total: number) => string;

  // Step 1
  q1Service: string;
  services: {
    "Water quality testing": string;
    "Wastewater testing": string;
    "Sample collection": string;
    "Environmental analysis": string;
    "Customer support": string;
    Other: string;
  };
  referralQuestion: string;
  optional: string;
  referralSources: {
    Website: string;
    "Social Media": string;
    "Government Agency": string;
    Company: string;
    "Friend/Colleague": string;
    Other: string;
  };

  // Step 2
  q2Satisfaction: string;
  satisfactionLabels: string[];
  q3RateFollowing: string;
  scalePoorExcellent: string;
  ratingLabels: {
    "rating_staff_professionalism": string;
    "rating_speed_of_service": string;
    "rating_ease_of_submitting_samples": string;
    "rating_clarity_of_reports": string;
    "rating_communication": string;
    "rating_cleanliness": string;
    "rating_overall_experience": string;
  };

  // Step 3
  q4ResultsOnTime: string;
  q5ReportsEasy: string;
  q6Recommend: string;
  npsNotLikely: string;
  npsExtremelyLikely: string;
  yesNoPartial: { Yes: string; No: string; Partially: string };
  easyOptions: { Yes: string; Somewhat: string; No: string };

  // Step 4
  q7LikedMost: string;
  likedMostPlaceholder: string;
  q8Improve: string;
  improvePlaceholder: string;
  q9Contact: string;
  yesNo: { Yes: string; No: string };
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactNamePlaceholder: string;
  contactEmailPlaceholder: string;
  contactPhonePlaceholder: string;
  q10Additional: string;
  additionalPlaceholder: string;

  // Navigation
  back: string;
  home: string;
  next: string;
  submit: string;

  // Success
  thankYou: string;
  thankYouMsg: (labName: string) => string;
  backToHome: string;

  // Error
  errorMsg: string;
}

export const translations: Record<Language, SurveyStrings> = {
  en: {
    surveyTitle: "Customer Satisfaction Survey",
    surveySubtitle: "Najran Central Laboratory for Water",
    takesTime: "Takes only 1–3 minutes",
    step: (n, total) => `Step ${n} of ${total}`,

    q1Service: "1. What service did you use today?",
    services: {
      "Water quality testing": "Water quality testing",
      "Wastewater testing": "Wastewater testing",
      "Sample collection": "Sample collection",
      "Environmental analysis": "Environmental analysis",
      "Customer support": "Customer support",
      Other: "Other",
    },
    referralQuestion: "How did you hear about us?",
    optional: "Optional",
    referralSources: {
      Website: "Website",
      "Social Media": "Social Media",
      "Government Agency": "Government Agency",
      Company: "Company",
      "Friend/Colleague": "Friend/Colleague",
      Other: "Other",
    },

    q2Satisfaction: "2. How satisfied are you with our service?",
    satisfactionLabels: ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"],
    q3RateFollowing: "3. How would you rate the following?",
    scalePoorExcellent: "Scale: 1 (Poor) – 5 (Excellent)",
    ratingLabels: {
      "rating_staff_professionalism": "Staff professionalism",
      "rating_speed_of_service": "Speed of service",
      "rating_ease_of_submitting_samples": "Ease of submitting samples",
      "rating_clarity_of_reports": "Clarity of test reports",
      "rating_communication": "Communication and updates",
      "rating_cleanliness": "Laboratory cleanliness",
      "rating_overall_experience": "Overall experience",
    },

    q4ResultsOnTime: "4. Did you receive your test results within the expected time?",
    q5ReportsEasy: "5. Were the test reports easy to understand?",
    q6Recommend: "6. How likely are you to recommend Najran Central Laboratory to others?",
    npsNotLikely: "Not likely",
    npsExtremelyLikely: "Extremely likely",
    yesNoPartial: { Yes: "Yes", No: "No", Partially: "Partially" },
    easyOptions: { Yes: "Yes", Somewhat: "Somewhat", No: "No" },

    q7LikedMost: "7. What did you like most about our service?",
    likedMostPlaceholder: "Tell us what impressed you...",
    q8Improve: "8. What can we improve?",
    improvePlaceholder: "Your suggestions for improvement...",
    q9Contact: "9. Would you like us to contact you regarding your feedback?",
    yesNo: { Yes: "Yes", No: "No" },
    contactName: "Name",
    contactEmail: "Email",
    contactPhone: "Phone",
    contactNamePlaceholder: "Your name",
    contactEmailPlaceholder: "you@example.com",
    contactPhonePlaceholder: "+966...",
    q10Additional: "10. Any additional comments or suggestions?",
    additionalPlaceholder: "Anything else you'd like to share...",

    back: "Back",
    home: "Home",
    next: "Next",
    submit: "Submit Survey",

    thankYou: "Thank You!",
    thankYouMsg: (labName) =>
      `Your feedback has been submitted successfully. We appreciate you taking the time to help us improve our services at ${labName}.`,
    backToHome: "Back to Home",

    errorMsg: "Failed to submit your survey. Please try again.",
  },

  ar: {
    surveyTitle: "استبيان رضا العملاء",
    surveySubtitle: "المختبر المركزي لنجران للمياه",
    takesTime: "يستغرق دقيقة إلى 3 دقائق فقط",
    step: (n, total) => `الخطوة ${n} من ${total}`,

    q1Service: "١. ما الخدمة التي استخدمتها اليوم؟",
    services: {
      "Water quality testing": "اختبار جودة المياه",
      "Wastewater testing": "اختبار مياه الصرف",
      "Sample collection": "جمع العينات",
      "Environmental analysis": "التحليل البيئي",
      "Customer support": "دعم العملاء",
      Other: "أخرى",
    },
    referralQuestion: "كيف عرفت عنّا؟",
    optional: "اختياري",
    referralSources: {
      Website: "الموقع الإلكتروني",
      "Social Media": "وسائل التواصل الاجتماعي",
      "Government Agency": "جهة حكومية",
      Company: "شركة",
      "Friend/Colleague": "صديق / زميل",
      Other: "أخرى",
    },

    q2Satisfaction: "٢. ما مدى رضاك عن خدمتنا؟",
    satisfactionLabels: ["غير راضٍ جداً", "غير راضٍ", "محايد", "راضٍ", "راضٍ جداً"],
    q3RateFollowing: "٣. كيف تقيّم ما يلي؟",
    scalePoorExcellent: "المقياس: ١ (ضعيف) – ٥ (ممتاز)",
    ratingLabels: {
      "rating_staff_professionalism": "احترافية الموظفين",
      "rating_speed_of_service": "سرعة الخدمة",
      "rating_ease_of_submitting_samples": "سهولة تقديم العينات",
      "rating_clarity_of_reports": "وضوح تقارير الاختبار",
      "rating_communication": "التواصل والتحديثات",
      "rating_cleanliness": "نظافة المختبر",
      "rating_overall_experience": "التجربة العامة",
    },

    q4ResultsOnTime: "٤. هل تلقيت نتائج الاختبار خلال الوقت المتوقع؟",
    q5ReportsEasy: "٥. هل كانت تقارير الاختبار سهلة الفهم؟",
    q6Recommend: "٦. ما مدى احتمالية أن توصي بالمختبر المركزي لنجران للآخرين؟",
    npsNotLikely: "غير محتمل",
    npsExtremelyLikely: "محتمل جداً",
    yesNoPartial: { Yes: "نعم", No: "لا", Partially: "جزئياً" },
    easyOptions: { Yes: "نعم", Somewhat: "إلى حد ما", No: "لا" },

    q7LikedMost: "٧. ما الذي أعجبك أكثر في خدمتنا؟",
    likedMostPlaceholder: "أخبرنا بما أبهرك...",
    q8Improve: "٨. ما الذي يمكننا تحسينه؟",
    improvePlaceholder: "اقتراحاتك للتحسين...",
    q9Contact: "٩. هل ترغب في أن نتواصل معك بخصوص ملاحظاتك؟",
    yesNo: { Yes: "نعم", No: "لا" },
    contactName: "الاسم",
    contactEmail: "البريد الإلكتروني",
    contactPhone: "الهاتف",
    contactNamePlaceholder: "اسمك",
    contactEmailPlaceholder: "you@example.com",
    contactPhonePlaceholder: "+966...",
    q10Additional: "١٠. أي تعليقات أو اقتراحات إضافية؟",
    additionalPlaceholder: "أي شيء آخر تود مشاركته...",

    back: "رجوع",
    home: "الرئيسية",
    next: "التالي",
    submit: "إرسال الاستبيان",

    thankYou: "شكراً لك!",
    thankYouMsg: (labName) =>
      `تم إرسال ملاحظاتك بنجاح. نقدر وقتك في مساعدتنا على تحسين خدماتنا في ${labName}.`,
    backToHome: "العودة للرئيسية",

    errorMsg: "فشل إرسال الاستبيان. يرجى المحاولة مرة أخرى.",
  },
};

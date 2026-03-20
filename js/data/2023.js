// 2023年度入学者用 立命館大学経営学部 卒業要件データ
const DATA_2023 = {
  year: 2023,
  totalRequired: 124,
  fourthYearMinimum: 4, // 4回生時以上において4単位以上修得

  departments: {
    international: {
      name: "国際経営学科",
      requirements: {
        liberal: { label: "教養科目", min: 20, description: "立命館科目・A群〜E群" },
        specialized: { label: "専門科目", min: 68, description: "学部共通＋展開科目" },
        specializedOwn: { label: "自学科科目", min: 12, description: "専門科目68単位のうち自学科科目6科目12単位以上" },
        generalFoundation: { label: "総合基礎科目", minSubjects: 3, min: 6, description: "企業と経営、企業と会計、マネジメント論、マーケティング論、経済学入門の5科目から3科目6単位以上" },
      },
      generalFoundationSubjects: [
        { name: "企業と経営", credits: 2 },
        { name: "企業と会計", credits: 2 },
        { name: "マネジメント論", credits: 2 },
        { name: "マーケティング論", credits: 2 },
        { name: "経済学入門", credits: 2 },
      ],
      foreignLanguageCourses: {
        english: {
          label: "英語コース",
          courseHelp: "英語のみを履修するコース",
          patterns: {
            AA: {
              label: "AAパターン",
              patternHelp: "TOEIC 550以上の学生向け。選択英語の幅が広い",
              totalRequired: 30,
              mandatoryTotal: 18,
              elective: { label: "選択英語（選択必修）", min: 12 },
              description: "必修18単位 + 選択必修12単位 = 30単位"
            },
            AB: {
              label: "ABパターン",
              patternHelp: "TOEIC 550以上だが英語実習も履修するパターン",
              totalRequired: 30,
              mandatoryTotal: 18,
              elective: { label: "選択英語（選択必修）", min: 12 },
              description: "必修18単位 + 選択必修12単位 = 30単位"
            },
            BA: {
              label: "BAパターン",
              patternHelp: "TOEIC 550未満。資格英語演習B・Step-up Englishを履修",
              totalRequired: 30,
              mandatoryTotal: 22,
              elective: { label: "選択英語（選択必修）", min: 8 },
              description: "必修22単位 + 選択必修8単位 = 30単位"
            },
            BB: {
              label: "BBパターン",
              patternHelp: "TOEIC 550未満。必修が最も多く、選択必修は4単位のみ",
              totalRequired: 30,
              mandatoryTotal: 26,
              elective: { label: "選択英語（選択必修）", min: 4 },
              description: "必修26単位 + 選択必修4単位 = 30単位"
            },
          }
        },
        bilingualEnglish: {
          label: "2言語英語重視コース",
          courseHelp: "英語＋初修外国語を履修し、英語の比重が大きいコース",
          patterns: {
            AA: {
              label: "AAパターン",
              patternHelp: "TOEIC 550以上。英語必修18 + 初修6 + 選択英語6",
              totalRequired: 30,
              mandatoryTotal: 24,
              elective: { label: "選択英語（選択必修）", min: 6 },
              description: "英語必修18 + 初修6 + 選択必修6 = 30単位"
            },
            AB: {
              label: "ABパターン",
              patternHelp: "TOEIC 550以上で英語実習も履修。英語必修18 + 初修6 + 選択英語6",
              totalRequired: 30,
              mandatoryTotal: 24,
              elective: { label: "選択英語（選択必修）", min: 6 },
              description: "英語必修18 + 初修6 + 選択必修6 = 30単位"
            },
            BA: {
              label: "BAパターン",
              patternHelp: "TOEIC 550未満（リーディングが得意）。英語必修22 + 初修6 + 選択英語2",
              totalRequired: 30,
              mandatoryTotal: 28,
              elective: { label: "選択英語（選択必修）", min: 2 },
              description: "英語必修22 + 初修6 + 選択必修2 = 30単位"
            },
            BB: {
              label: "BBパターン",
              patternHelp: "TOEIC 550未満。英語必修24 + 初修6。選択必修なし",
              totalRequired: 30,
              mandatoryTotal: 30,
              elective: { label: "選択英語", min: 0 },
              description: "英語必修24 + 初修6 = 30単位"
            },
          }
        },
        bilingualSecond: {
          label: "2言語初修重視コース",
          courseHelp: "英語＋初修外国語を履修し、初修外国語の比重が大きいコース",
          totalRequired: 30,
          mandatoryEnglish: 9,
          mandatorySecond: 9,
          electiveSecond: { label: "選択初修外国語（選択必修）", min: 12, description: "選択初修外国語科目12単位以上" },
          description: "英語必修9 + 初修必修9 + 選択必修12 = 30単位"
        }
      }
    },

    business: {
      name: "経営学科",
      courses: ["組織", "戦略", "マーケティング", "会計・ファイナンス"],
      requirements: {
        liberal: { label: "教養科目", min: 24, description: "立命館科目・A群〜E群" },
        specialized: { label: "専門科目", min: 74, description: "学部共通＋コース科目" },
        specializedOwn: { label: "自コース科目", min: 12, description: "専門科目74単位のうち自コース科目6科目12単位以上" },
        generalFoundation: { label: "総合基礎科目", minSubjects: 3, min: 6, description: "企業と経営、企業と会計、マネジメント論、マーケティング論、経済学入門の5科目から3科目6単位以上" },
      },
      generalFoundationSubjects: [
        { name: "企業と経営", credits: 2 },
        { name: "企業と会計", credits: 2 },
        { name: "マネジメント論", credits: 2 },
        { name: "マーケティング論", credits: 2 },
        { name: "経済学入門", credits: 2 },
      ],
      foreignLanguageCourses: {
        english: {
          label: "英語コース",
          courseHelp: "英語のみを履修するコース",
          totalRequired: 12,
          mandatory: [
            { year: 1, label: "1回生英語", credits: 4 },
            { year: 2, label: "2回生英語", credits: 4 },
          ],
          elective: { label: "選択英語", min: 2, description: "選択英語科目2単位" },
          mandatoryTotal: 8,
          description: "必修8単位 + 選択2単位 + 残り自由"
        },
        bilingual: {
          label: "2言語コース",
          courseHelp: "英語＋初修外国語（または日本語）を履修するコース",
          types: {
            englishSecond: {
              label: "英語＋初修",
              totalRequired: 12,
              mandatoryTotal: 10,
              elective: { label: "選択英語", min: 0 },
              description: "英語5 + 初修5 + 選択1 + 選択1"
            },
            englishJapanese: {
              label: "英語＋日本語（留学生）",
              totalRequired: 12,
              mandatoryTotal: 10,
              description: "英語5 + 日本語5 + 選択2"
            },
            secondJapanese: {
              label: "初修＋日本語（留学生）",
              totalRequired: 12,
              mandatoryTotal: 12,
              description: "初修6 + 日本語6"
            }
          }
        }
      }
    }
  },

  registrationLimits: {
    1: 44, 2: 44, 3: 48, 4: 48
  }
};

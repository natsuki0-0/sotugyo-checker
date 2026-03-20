// 卒業要件判定ロジック
function checkGraduation(data, input) {
  const dept = data.departments[input.department];
  const results = [];
  let allPassed = true;

  // 1. 教養科目
  const liberalReq = dept.requirements.liberal.min;
  const liberalCurrent = input.liberalCredits;
  const liberalShort = Math.max(0, liberalReq - liberalCurrent);
  const liberalOk = liberalCurrent >= liberalReq;
  if (!liberalOk) allPassed = false;
  results.push({
    label: dept.requirements.liberal.label,
    required: liberalReq + "単位以上",
    current: liberalCurrent,
    shortage: liberalShort,
    ok: liberalOk
  });

  // 2. 外国語科目
  const foreignResult = checkForeignLanguage(dept, input);
  foreignResult.forEach(r => {
    if (!r.ok) allPassed = false;
    results.push(r);
  });

  // 3. 専門科目（合計）
  const specReq = dept.requirements.specialized.min;
  const specCurrent = input.specializedCredits;
  const specShort = Math.max(0, specReq - specCurrent);
  const specOk = specCurrent >= specReq;
  if (!specOk) allPassed = false;
  results.push({
    label: dept.requirements.specialized.label,
    required: specReq + "単位以上",
    current: specCurrent,
    shortage: specShort,
    ok: specOk
  });

  // 4. 自学科/自コース科目
  const ownReq = dept.requirements.specializedOwn.min;
  const ownCurrent = input.ownCredits;
  const ownShort = Math.max(0, ownReq - ownCurrent);
  const ownOk = ownCurrent >= ownReq;
  if (!ownOk) allPassed = false;
  results.push({
    label: input.department === "international" ? "自学科科目" : "自コース科目",
    required: ownReq + "単位以上",
    current: ownCurrent,
    shortage: ownShort,
    ok: ownOk
  });

  // 5. 総合基礎科目
  const gfReq = dept.requirements.generalFoundation;
  const gfCount = input.generalFoundationChecked;
  const gfCredits = gfCount * 2;
  const gfCountOk = gfCount >= gfReq.minSubjects;
  const gfCreditsOk = gfCredits >= gfReq.min;
  const gfOk = gfCountOk && gfCreditsOk;
  if (!gfOk) allPassed = false;
  results.push({
    label: "総合基礎科目",
    required: gfReq.minSubjects + "科目" + gfReq.min + "単位以上",
    current: gfCount + "科目" + gfCredits + "単位",
    shortage: gfOk ? 0 : Math.max(0, gfReq.minSubjects - gfCount) + "科目不足",
    ok: gfOk
  });

  // 6. 4回生時修得
  const fourthReq = data.fourthYearMinimum;
  const fourthCurrent = input.fourthYearCredits;
  const fourthShort = Math.max(0, fourthReq - fourthCurrent);
  const fourthOk = fourthCurrent >= fourthReq;
  if (!fourthOk) allPassed = false;
  results.push({
    label: "4回生時修得単位",
    required: fourthReq + "単位以上",
    current: fourthCurrent,
    shortage: fourthShort,
    ok: fourthOk
  });

  // 7. 合計
  const totalReq = data.totalRequired;
  const totalCurrent = input.totalCredits;
  const totalShort = Math.max(0, totalReq - totalCurrent);
  const totalOk = totalCurrent >= totalReq;
  if (!totalOk) allPassed = false;
  results.push({
    label: "総修得単位数",
    required: totalReq + "単位以上",
    current: totalCurrent,
    shortage: totalShort,
    ok: totalOk
  });

  return { results, allPassed };
}

function checkForeignLanguage(dept, input) {
  const results = [];

  if (input.department === "international") {
    // 国際経営学科
    const langCourse = input.langCourse;
    let totalRequired, mandatoryRequired, electiveRequired;

    if (langCourse === "bilingualSecond") {
      // 2言語初修重視コース（パターン分けなし）
      const conf = dept.foreignLanguageCourses.bilingualSecond;
      totalRequired = conf.totalRequired;
      mandatoryRequired = conf.mandatoryEnglish + conf.mandatorySecond;
      electiveRequired = conf.electiveSecond.min;

      const mandatoryCurrent = input.foreignMandatoryCredits;
      const mandatoryOk = mandatoryCurrent >= mandatoryRequired;
      results.push({
        label: "外国語（英語+初修 必修）",
        required: mandatoryRequired + "単位以上",
        current: mandatoryCurrent,
        shortage: Math.max(0, mandatoryRequired - mandatoryCurrent),
        ok: mandatoryOk
      });

      const secondCurrent = input.foreignSecondCredits;
      const secondOk = secondCurrent >= electiveRequired;
      results.push({
        label: "選択初修外国語（選択必修）",
        required: electiveRequired + "単位以上",
        current: secondCurrent,
        shortage: Math.max(0, electiveRequired - secondCurrent),
        ok: secondOk
      });
    } else {
      // 英語コース or 2言語英語重視コース
      const courseData = dept.foreignLanguageCourses[langCourse];
      const pattern = courseData.patterns[input.langPattern];
      totalRequired = pattern.totalRequired;
      mandatoryRequired = pattern.mandatoryTotal;
      electiveRequired = pattern.elective.min;

      const mandatoryCurrent = input.foreignMandatoryCredits;
      const mandatoryOk = mandatoryCurrent >= mandatoryRequired;
      results.push({
        label: "外国語（必修）",
        required: mandatoryRequired + "単位以上",
        current: mandatoryCurrent,
        shortage: Math.max(0, mandatoryRequired - mandatoryCurrent),
        ok: mandatoryOk
      });

      if (electiveRequired > 0) {
        const electiveCurrent = input.foreignElectiveCredits;
        const electiveOk = electiveCurrent >= electiveRequired;
        results.push({
          label: "選択英語（選択必修）",
          required: electiveRequired + "単位以上",
          current: electiveCurrent,
          shortage: Math.max(0, electiveRequired - electiveCurrent),
          ok: electiveOk
        });
      }

      if (langCourse === "bilingualEnglish") {
        // 2言語英語重視は初修/日本語の必修もある
        const secondCurrent = input.foreignSecondCredits;
        const secondRequired = 6; // 初修6単位
        const secondOk = secondCurrent >= secondRequired;
        results.push({
          label: "初修外国語/日本語（必修）",
          required: secondRequired + "単位以上",
          current: secondCurrent,
          shortage: Math.max(0, secondRequired - secondCurrent),
          ok: secondOk
        });
      }
    }

    // 外国語合計チェック
    let foreignTotal = input.foreignMandatoryCredits + input.foreignElectiveCredits + (input.foreignSecondCredits || 0);
    const foreignTotalReq = totalRequired;
    const foreignTotalOk = foreignTotal >= foreignTotalReq;
    results.push({
      label: "外国語 合計",
      required: foreignTotalReq + "単位以上",
      current: foreignTotal,
      shortage: Math.max(0, foreignTotalReq - foreignTotal),
      ok: foreignTotalOk
    });

  } else {
    // 経営学科
    const langCourse = input.langCourse;
    let totalRequired;

    if (langCourse === "english") {
      const conf = dept.foreignLanguageCourses.english;
      totalRequired = conf.totalRequired;

      const mandatoryCurrent = input.foreignMandatoryCredits;
      const mandatoryOk = mandatoryCurrent >= conf.mandatoryTotal;
      results.push({
        label: "外国語（必修）",
        required: conf.mandatoryTotal + "単位以上",
        current: mandatoryCurrent,
        shortage: Math.max(0, conf.mandatoryTotal - mandatoryCurrent),
        ok: mandatoryOk
      });

      const electiveCurrent = input.foreignElectiveCredits;
      const electiveOk = electiveCurrent >= conf.elective.min;
      results.push({
        label: "選択英語",
        required: conf.elective.min + "単位以上",
        current: electiveCurrent,
        shortage: Math.max(0, conf.elective.min - electiveCurrent),
        ok: electiveOk
      });
    } else {
      // 2言語コース
      const typeData = dept.foreignLanguageCourses.bilingual.types[input.langType];
      totalRequired = typeData.totalRequired;

      const mandatoryCurrent = input.foreignMandatoryCredits;
      const mandatoryOk = mandatoryCurrent >= typeData.mandatoryTotal;
      results.push({
        label: "外国語（必修）",
        required: typeData.mandatoryTotal + "単位以上",
        current: mandatoryCurrent,
        shortage: Math.max(0, typeData.mandatoryTotal - mandatoryCurrent),
        ok: mandatoryOk
      });

      if (input.foreignSecondCredits !== undefined) {
        const secondCurrent = input.foreignSecondCredits;
        results.push({
          label: "初修/日本語",
          required: "—",
          current: secondCurrent,
          shortage: 0,
          ok: true
        });
      }
    }

    // 外国語合計
    let foreignTotal = input.foreignMandatoryCredits + input.foreignElectiveCredits + (input.foreignSecondCredits || 0);
    const foreignTotalOk = foreignTotal >= totalRequired;
    results.push({
      label: "外国語 合計",
      required: totalRequired + "単位以上",
      current: foreignTotal,
      shortage: Math.max(0, totalRequired - foreignTotal),
      ok: foreignTotalOk
    });
  }

  return results;
}

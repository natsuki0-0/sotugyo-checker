// アプリケーション メインロジック
(function() {
  // データマップ（年度追加時はここに追加）
  const DATA_MAP = {
    2023: DATA_2023,
    2024: DATA_2024,
  };

  function getCurrentData() {
    const year = document.getElementById("year").value;
    return DATA_MAP[year];
  }

  // === 初期化 ===
  document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
  });

  function setupEventListeners() {
    document.getElementById("department").addEventListener("change", onDepartmentChange);
    document.getElementById("course").addEventListener("change", updateUI);
    document.getElementById("lang-course").addEventListener("change", onLangCourseChange);
    document.getElementById("lang-pattern").addEventListener("change", updateForeignUI);
    document.getElementById("lang-type").addEventListener("change", updateForeignUI);
    document.getElementById("year").addEventListener("change", onYearChange);

    // 単位入力フィールドの変更で合計を自動計算
    ["liberal-credits", "foreign-mandatory-credits", "foreign-elective-credits", "foreign-second-credits", "specialized-credits"].forEach(id => {
      document.getElementById(id).addEventListener("input", autoCalcTotal);
    });

    document.getElementById("btn-check").addEventListener("click", runCheck);
    document.getElementById("btn-sample").addEventListener("click", fillSample);
    document.getElementById("btn-reset").addEventListener("click", resetForm);
  }

  function autoCalcTotal() {
    const liberal = parseInt(document.getElementById("liberal-credits").value) || 0;
    const foreignMandatory = parseInt(document.getElementById("foreign-mandatory-credits").value) || 0;
    const foreignElective = parseInt(document.getElementById("foreign-elective-credits").value) || 0;
    const foreignSecond = parseInt(document.getElementById("foreign-second-credits").value) || 0;
    const specialized = parseInt(document.getElementById("specialized-credits").value) || 0;
    document.getElementById("total-credits").value = liberal + foreignMandatory + foreignElective + foreignSecond + specialized;
  }

  function onYearChange() {
    // 年度が変わったらリセット
    resetForm();
    document.getElementById("department").value = "";
    onDepartmentChange();
  }

  // === 学科変更 ===
  function onDepartmentChange() {
    const dept = document.getElementById("department").value;
    const data = getCurrentData();

    // コース表示
    const courseGroup = document.getElementById("course-group");
    courseGroup.style.display = dept === "business" ? "" : "none";
    if (dept !== "business") document.getElementById("course").value = "";

    // 外国語コース生成
    const langCourseGroup = document.getElementById("lang-course-group");
    const langCourseSelect = document.getElementById("lang-course");
    langCourseSelect.innerHTML = '<option value="">選択してください</option>';

    if (dept && data) {
      const deptData = data.departments[dept];
      const flc = deptData.foreignLanguageCourses;

      if (dept === "international") {
        Object.keys(flc).forEach(key => {
          const opt = document.createElement("option");
          opt.value = key;
          opt.textContent = flc[key].label;
          langCourseSelect.appendChild(opt);
        });
      } else {
        Object.keys(flc).forEach(key => {
          const opt = document.createElement("option");
          opt.value = key;
          opt.textContent = flc[key].label;
          langCourseSelect.appendChild(opt);
        });
      }
      langCourseGroup.style.display = "";
    } else {
      langCourseGroup.style.display = "none";
    }

    // パターン非表示
    document.getElementById("lang-pattern-group").style.display = "none";
    document.getElementById("lang-type-group").style.display = "none";

    // 入力セクション表示
    document.getElementById("credits-input").style.display = dept ? "" : "none";
    document.getElementById("results").style.display = "none";

    updateUI();
  }

  // === 外国語コース変更 ===
  function onLangCourseChange() {
    const dept = document.getElementById("department").value;
    const langCourse = document.getElementById("lang-course").value;
    const data = getCurrentData();
    const patternGroup = document.getElementById("lang-pattern-group");
    const patternSelect = document.getElementById("lang-pattern");
    const typeGroup = document.getElementById("lang-type-group");
    const typeSelect = document.getElementById("lang-type");

    patternGroup.style.display = "none";
    typeGroup.style.display = "none";
    patternSelect.innerHTML = "";
    typeSelect.innerHTML = "";

    if (!dept || !langCourse || !data) return;

    const deptData = data.departments[dept];

    // コースの説明を表示
    const courseHelp = document.getElementById("lang-course-help");
    const courseData = deptData.foreignLanguageCourses[langCourse];
    if (courseData && courseData.courseHelp) {
      courseHelp.textContent = courseData.courseHelp;
      courseHelp.style.display = "";
    } else {
      courseHelp.style.display = "none";
    }

    if (dept === "international") {
      if (langCourse === "bilingualSecond") {
        // 2言語初修重視はパターンなし
      } else {
        // 英語 or 2言語英語重視 → パターン選択
        const courseData = deptData.foreignLanguageCourses[langCourse];
        if (courseData.patterns) {
          Object.keys(courseData.patterns).forEach(key => {
            const opt = document.createElement("option");
            opt.value = key;
            opt.textContent = courseData.patterns[key].label;
            patternSelect.appendChild(opt);
          });
          patternGroup.style.display = "";
        }
      }
    } else {
      // 経営学科
      if (langCourse === "bilingual") {
        const types = deptData.foreignLanguageCourses.bilingual.types;
        Object.keys(types).forEach(key => {
          const opt = document.createElement("option");
          opt.value = key;
          opt.textContent = types[key].label;
          typeSelect.appendChild(opt);
        });
        typeGroup.style.display = "";
      }
    }

    updateForeignUI();
  }

  // === UI更新 ===
  function updateUI() {
    const dept = document.getElementById("department").value;
    const data = getCurrentData();
    if (!dept || !data) return;

    const deptData = data.departments[dept];

    // 教養科目の説明
    document.getElementById("liberal-desc").textContent =
      deptData.requirements.liberal.description + "（" + deptData.requirements.liberal.min + "単位以上）";

    // 自学科/自コースラベル
    document.getElementById("own-label").textContent =
      dept === "international" ? "自学科科目" : "自コース科目";

    updateForeignUI();
  }

  // === 外国語UI更新 ===
  function updateForeignUI() {
    const dept = document.getElementById("department").value;
    const langCourse = document.getElementById("lang-course").value;
    const data = getCurrentData();
    if (!dept || !langCourse || !data) return;

    const deptData = data.departments[dept];
    const foreignDesc = document.getElementById("foreign-desc");
    const electiveSection = document.getElementById("foreign-elective-section");
    const electiveLabel = document.getElementById("foreign-elective-label");
    const secondSection = document.getElementById("foreign-second-section");

    electiveSection.style.display = "";
    secondSection.style.display = "none";

    // パターンの説明を表示
    const patternHelp = document.getElementById("lang-pattern-help");
    patternHelp.style.display = "none";

    if (dept === "international") {
      if (langCourse === "bilingualSecond") {
        const conf = deptData.foreignLanguageCourses.bilingualSecond;
        foreignDesc.textContent = conf.description;
        electiveLabel.textContent = conf.electiveSecond.label;
        secondSection.style.display = "none";
        // 必修は英語+初修合算
      } else {
        const courseData = deptData.foreignLanguageCourses[langCourse];
        const pattern = document.getElementById("lang-pattern").value;
        if (pattern && courseData.patterns[pattern]) {
          const p = courseData.patterns[pattern];
          foreignDesc.textContent = p.description;
          // パターンの説明を表示
          if (p.patternHelp) {
            patternHelp.textContent = p.patternHelp;
            patternHelp.style.display = "";
          }
          if (p.elective.min > 0) {
            electiveSection.style.display = "";
            electiveLabel.textContent = p.elective.label || "選択英語（選択必修）";
          } else {
            electiveSection.style.display = "none";
          }
          // 2言語英語重視は初修の入力も必要
          if (langCourse === "bilingualEnglish") {
            secondSection.style.display = "";
          }
        } else {
          foreignDesc.textContent = courseData.label;
        }
      }
    } else {
      // 経営学科
      if (langCourse === "english") {
        const conf = deptData.foreignLanguageCourses.english;
        foreignDesc.textContent = conf.description;
        electiveLabel.textContent = "選択英語";
      } else {
        const langType = document.getElementById("lang-type").value;
        if (langType) {
          const typeData = deptData.foreignLanguageCourses.bilingual.types[langType];
          foreignDesc.textContent = typeData.description;
          if (typeData.elective && typeData.elective.min > 0) {
            electiveSection.style.display = "";
            electiveLabel.textContent = "選択英語";
          } else {
            electiveSection.style.display = "none";
          }
          secondSection.style.display = "";
        }
      }
    }
  }

  // === 判定実行 ===
  function runCheck() {
    const data = getCurrentData();
    const dept = document.getElementById("department").value;
    if (!data || !dept) {
      alert("学科を選択してください");
      return;
    }

    const langCourse = document.getElementById("lang-course").value;
    if (!langCourse) {
      alert("外国語コースを選択してください");
      return;
    }

    const input = {
      department: dept,
      langCourse: langCourse,
      langPattern: document.getElementById("lang-pattern").value,
      langType: document.getElementById("lang-type").value,
      liberalCredits: parseInt(document.getElementById("liberal-credits").value) || 0,
      foreignMandatoryCredits: parseInt(document.getElementById("foreign-mandatory-credits").value) || 0,
      foreignElectiveCredits: parseInt(document.getElementById("foreign-elective-credits").value) || 0,
      foreignSecondCredits: parseInt(document.getElementById("foreign-second-credits").value) || 0,
      specializedCredits: parseInt(document.getElementById("specialized-credits").value) || 0,
      ownCredits: parseInt(document.getElementById("own-credits").value) || 0,
      generalFoundationCredits: parseInt(document.getElementById("general-foundation-credits").value) || 0,
      thesisCompleted: document.getElementById("thesis-check").checked,
      fourthYearCredits: parseInt(document.getElementById("fourth-year-credits").value) || 0,
      totalCredits: parseInt(document.getElementById("total-credits").value) || 0,
    };

    const result = checkGraduation(data, input);
    renderResults(result);
  }

  // === 結果表示 ===
  function renderResults(result) {
    const section = document.getElementById("results");
    section.style.display = "";

    const summary = document.getElementById("result-summary");
    if (result.allPassed) {
      summary.className = "result-summary ok";
      summary.textContent = "全ての卒業要件を満たしています";
    } else {
      summary.className = "result-summary ng";
      summary.textContent = "不足している要件があります";
    }

    const tbody = document.getElementById("result-tbody");
    tbody.innerHTML = "";

    result.results.forEach(r => {
      const tr = document.createElement("tr");

      const tdLabel = document.createElement("td");
      tdLabel.textContent = r.label;

      const tdReq = document.createElement("td");
      tdReq.textContent = r.required;

      const tdCurrent = document.createElement("td");
      tdCurrent.textContent = r.current;

      const tdShort = document.createElement("td");
      tdShort.textContent = r.ok ? "—" : r.shortage;
      tdShort.className = r.ok ? "" : "status-ng";

      const tdStatus = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = r.ok ? "badge badge-ok" : "badge badge-ng";
      badge.textContent = r.ok ? "OK" : "不足";
      tdStatus.appendChild(badge);

      tr.appendChild(tdLabel);
      tr.appendChild(tdReq);
      tr.appendChild(tdCurrent);
      tr.appendChild(tdShort);
      tr.appendChild(tdStatus);
      tbody.appendChild(tr);
    });

    // 結果にスクロール
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // === サンプル入力 ===
  function fillSample() {
    const dept = document.getElementById("department").value;
    if (!dept) {
      alert("先に学科を選択してください");
      return;
    }

    if (dept === "international") {
      document.getElementById("liberal-credits").value = 22;
      document.getElementById("foreign-mandatory-credits").value = 18;
      document.getElementById("foreign-elective-credits").value = 12;
      document.getElementById("foreign-second-credits").value = 0;
      document.getElementById("specialized-credits").value = 70;
      document.getElementById("own-credits").value = 14;
      document.getElementById("general-foundation-credits").value = 6;
      document.getElementById("fourth-year-credits").value = 8;
      autoCalcTotal();
    } else {
      document.getElementById("liberal-credits").value = 26;
      document.getElementById("foreign-mandatory-credits").value = 8;
      document.getElementById("foreign-elective-credits").value = 4;
      document.getElementById("foreign-second-credits").value = 0;
      document.getElementById("specialized-credits").value = 76;
      document.getElementById("own-credits").value = 14;
      document.getElementById("general-foundation-credits").value = 6;
      document.getElementById("fourth-year-credits").value = 6;
      autoCalcTotal();
    }
  }

  // === リセット ===
  function resetForm() {
    document.querySelectorAll('#credits-input input[type="number"]').forEach(input => {
      input.value = 0;
    });
    document.querySelectorAll('#credits-input input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
    document.getElementById("results").style.display = "none";
  }
})();

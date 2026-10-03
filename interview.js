// =============================================
// HYBRIDHIRE AI - Interview Preparation (Dynamic)
// =============================================

document.addEventListener('DOMContentLoaded', function () {

    const API_BASE_URL = 'http://localhost:8080';
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        window.location.href = "login.html";
        return;
    }
    loadInterviewDashboard();

    async function loadInterviewDashboard() {

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/interview/dashboard`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load interview dashboard: " + response.status
                );
            }

            const data = await response.json();

            console.log("Interview Dashboard Data:", data);


            const readinessScore =
                document.getElementById("readinessScore");

            const readinessCircle =
                document.getElementById("readinessCircle");

            const score = data.readinessScore ?? 0;

            if (readinessScore) {
                readinessScore.textContent = `${score}%`;
            }

            if (readinessCircle) {

                const circumference = 283;

                const offset =
                    circumference -
                    (circumference * score / 100);

                readinessCircle.style.strokeDasharray =
                    circumference;

                readinessCircle.style.strokeDashoffset =
                    offset;
            }

            const skills = [
                {
                    value: data.technicalInterview ?? 0,
                    percentId: "techPercent",
                    barId: "techBar"
                },
                {
                    value: data.codingPractice ?? 0,
                    percentId: "codingPercent",
                    barId: "codingBar"
                },
                {
                    value: data.communicationSkills ?? 0,
                    percentId: "commPercent",
                    barId: "commBar"
                },
                {
                    value: data.hrInterview ?? 0,
                    percentId: "hrPercent",
                    barId: "hrBar"
                }
            ];

            skills.forEach(skill => {

                const percentElement =
                    document.getElementById(skill.percentId);

                const barElement =
                    document.getElementById(skill.barId);

                if (percentElement) {
                    percentElement.textContent =
                        `${skill.value}%`;
                }

                if (barElement) {
                    barElement.style.width =
                        `${skill.value}%`;
                }
            });


            // =============================================
            // LOAD PREVIOUS INTERVIEW ATTEMPTS
            // =============================================

            const historyResponse = await fetch(
                `${API_BASE_URL}/api/interview/history`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!historyResponse.ok) {
                throw new Error(
                    "Failed to load interview history: " +
                    historyResponse.status
                );
            }

            const history = await historyResponse.json();

            console.log("Interview History:", history);


            const historyContainer =
                document.getElementById(
                    "previousAttemptsContainer"
                );


            if (historyContainer) {

                historyContainer.innerHTML = "";


                if (!history || history.length === 0) {

                    historyContainer.innerHTML = `
                        <p class="text-on-surface-variant text-sm">
                            No previous interview attempts yet.
                        </p>
                    `;

                } else {

                    history.forEach(session => {

                        const date = session.createdAt
                            ? new Date(session.createdAt)
                                .toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })
                            : "Date unavailable";


                        const attempt =
                            document.createElement("div");


                        attempt.className =
                            "flex justify-between items-center p-3 " +
                            "bg-surface rounded-lg border " +
                            "border-outline-variant/30 " +
                            "hover:bg-surface-container " +
                            "transition-colors cursor-pointer " +
                            "previous-attempt";


                        attempt.innerHTML = `

                            <div class="flex items-center gap-3">

                                <div class="w-10 h-10 rounded bg-success-green/10 text-success-green flex items-center justify-center">

                                    <span class="material-symbols-outlined">
                                        code
                                    </span>

                                </div>


                                <div>

                                    <p class="font-body-sm text-body-sm
                                        font-semibold text-on-surface">

                                        Mock Interview

                                    </p>


                                    <p class="font-label-md text-label-md
                                        text-on-surface-variant">

                                        ${date}

                                    </p>

                                </div>

                            </div>


                            <div class="text-right">

                                <p class="font-headline-sm
                                    text-headline-sm
                                    text-on-surface text-lg">

                                    Attempt #${session.id}

                                </p>

                            </div>

                        `;


                        attempt.addEventListener(
                            "click",
                            function () {

                                showFeedbackModal(
                                    session.aiFeedback ||
                                    "No feedback available for this attempt."
                                );

                            }
                        );


                        historyContainer.appendChild(attempt);

                    });
                }
            }

        } catch (error) {

            console.error(
                "Interview Dashboard Error:",
                error
            );

        }
    }


    // =============================================
    // START MOCK INTERVIEW
    // =============================================

    let currentSessionId = null;
    let currentQuestions = [];

    const savedQuestions =
        localStorage.getItem("interviewPracticeQuestions");

    if (savedQuestions) {
        try {
            currentQuestions = JSON.parse(savedQuestions);
            renderPracticeQuestions(currentQuestions);
        } catch (error) {
            console.error(
                "Failed to load saved practice questions:",
                error
            );
            localStorage.removeItem("interviewPracticeQuestions");
        }
    }


    const startMockBtn =
        document.getElementById('startMockBtn');


    if (startMockBtn) {

        startMockBtn.addEventListener(
            "click",
            async function () {

                const resumeText =
                    prompt("Paste your resume text:");

                if (!resumeText) return;


                const jobDescription =
                    prompt("Paste the job description:");

                if (!jobDescription) return;


                this.disabled = true;
                this.innerText =
                    "Generating AI Questions...";


                try {

                    const response =
                        await fetch(
                            `${API_BASE_URL}/api/interview/questions`,
                            {
                                method: 'POST',

                                headers: {
                                    'Content-Type':
                                        'application/json',

                                    'Authorization':
                                        'Bearer ' + token
                                },

                                body: JSON.stringify({
                                    resumeText,
                                    jobDescription
                                })
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            'Failed to generate questions: ' +
                            response.status
                        );

                    }


                    const data =
                        await response.json();


                    currentSessionId =
                        data.sessionId;

                    currentQuestions =
                        data.questions || [];

                    renderPracticeQuestions(
                        currentQuestions
                    );
                    localStorage.setItem(
                        "interviewPracticeQuestions",
                        JSON.stringify(currentQuestions)
                    );


                    this.innerText =
                        "Start Mock Interview";

                    this.disabled = false;


                    showInterviewModal(
                        currentQuestions
                    );

                } catch (error) {

                    console.error(
                        "Interview API Error:",
                        error
                    );

                    alert(
                        '⚠️ Failed to start interview. ' +
                        'Check backend connection.'
                    );

                    this.disabled = false;

                    this.innerText =
                        "Start Mock Interview";
                }
            }
        );
    }

   function renderPracticeQuestions(questions) {
       const container = document.getElementById("practiceQuestionsContainer");

       if (!container) return;

       container.innerHTML = "";

       if (!questions || questions.length === 0) {
           container.innerHTML = `
               <tr>
                   <td colspan="2" class="text-center p-4 text-on-surface-variant">
                       No practice questions available.
                   </td>
               </tr>
           `;
           return;
       }

       questions.forEach((q, index) => {
           const row = document.createElement("tr");

           row.innerHTML = `
               <td class="p-4 text-on-surface">
                   ${q.question}
               </td>

               <td class="p-4 text-right">
                   <button
                       class="practice-btn bg-ai-blue text-white px-4 py-2 rounded-lg"
                       data-question="${encodeURIComponent(q.question)}">
                       Practice
                   </button>
               </td>
           `;

           container.appendChild(row);
       });
   }

    function showInterviewModal(questions) {

        const overlay =
            document.createElement('div');


        overlay.style.cssText =
            'position:fixed; inset:0; ' +
            'background:rgba(0,0,0,0.6); ' +
            'z-index:1000; display:flex; ' +
            'align-items:center; justify-content:center; ' +
            'padding:20px;';


        let questionsHtml = '';


        questions.forEach((q, i) => {

            questionsHtml += `

                <div style="margin-bottom:20px;">

                    <p style="
                        font-weight:600;
                        margin-bottom:4px;
                    ">

                        Q${i + 1}. ${q.question}

                    </p>


                    <p style="
                        font-size:12px;
                        color:#666;
                        margin-bottom:8px;
                    ">

                        Hint: ${q.hint}

                    </p>


                    <textarea
                        id="answer-${i}"
                        rows="3"
                        style="
                            width:100%;
                            padding:8px;
                            border:1px solid #ccc;
                            border-radius:6px;
                        "
                        placeholder="Your answer..."
                    ></textarea>

                </div>

            `;

        });


        overlay.innerHTML = `

            <div style="
                background:white;
                max-width:600px;
                width:100%;
                max-height:85vh;
                overflow-y:auto;
                border-radius:12px;
                padding:24px;
            ">

                <h2 style="
                    font-size:20px;
                    font-weight:700;
                    margin-bottom:16px;
                ">

                    Mock Interview Questions

                </h2>


                ${questionsHtml}


                <button
                    id="submitAnswersBtn"
                    style="
                        width:100%;
                        background:#3b82f6;
                        color:white;
                        padding:12px;
                        border-radius:8px;
                        font-weight:600;
                        border:none;
                        cursor:pointer;
                    "
                >

                    Submit Answers

                </button>

            </div>

        `;


        document.body.appendChild(overlay);


        document
            .getElementById('submitAnswersBtn')
            .addEventListener(
                'click',
                async function () {

                    let combinedAnswers = '';


                    questions.forEach((q, i) => {

                        const answerElement =
                            document.getElementById(
                                `answer-${i}`
                            );


                        const ans =
                            answerElement
                                ? answerElement.value.trim()
                                : "";


                        combinedAnswers +=
                            `Q${i + 1}: ${q.question}\n` +
                            `Answer: ${ans}\n\n`;

                    });


                    this.disabled = true;
                    this.innerText = "Evaluating...";


                    try {

                        const response =
                            await fetch(
                                `${API_BASE_URL}/api/interview/interview-result`,
                                {
                                    method: 'POST',

                                    headers: {
                                        'Content-Type':
                                            'application/json',

                                        'Authorization':
                                            'Bearer ' + token
                                    },

                                    body: JSON.stringify({

                                        sessionId:
                                            currentSessionId,

                                        studentAnswers:
                                            combinedAnswers

                                    })
                                }
                            );


                        if (!response.ok) {

                            throw new Error(
                                'Failed to evaluate: ' +
                                response.status
                            );

                        }


                        const feedback =
                            await response.text();


                        overlay.remove();


                        showFeedbackModal(
                            feedback
                        );


                        loadInterviewDashboard();


                    } catch (error) {

                        console.error(
                            "Evaluation Error:",
                            error
                        );

                        alert(
                            '⚠️ Failed to evaluate answers.'
                        );

                        this.disabled = false;

                        this.innerText =
                            "Submit Answers";
                    }

                }
            );
    }


    // =============================================
    // SHOW AI FEEDBACK
    // =============================================

    function showFeedbackModal(feedback) {

        const overlay =
            document.createElement('div');


        overlay.style.cssText =
            'position:fixed; inset:0; ' +
            'background:rgba(0,0,0,0.6); ' +
            'z-index:1000; display:flex; ' +
            'align-items:center; justify-content:center; ' +
            'padding:20px;';


        overlay.innerHTML = `

            <div style="
                background:white;
                max-width:600px;
                width:100%;
                max-height:85vh;
                overflow-y:auto;
                border-radius:12px;
                padding:24px;
            ">

                <h2 style="
                    font-size:20px;
                    font-weight:700;
                    margin-bottom:16px;
                ">

                    AI Feedback

                </h2>


                <pre style="
                    white-space:pre-wrap;
                    font-family:inherit;
                    font-size:14px;
                    line-height:1.6;
                ">${feedback}</pre>


                <button
                    id="closeFeedbackBtn"
                    style="
                        width:100%;
                        background:#3b82f6;
                        color:white;
                        padding:12px;
                        border-radius:8px;
                        font-weight:600;
                        border:none;
                        cursor:pointer;
                        margin-top:16px;
                    "
                >

                    Close

                </button>

            </div>

        `;


        document.body.appendChild(overlay);


        document
            .getElementById('closeFeedbackBtn')
            .addEventListener(
                'click',
                () => overlay.remove()
            );
    }

   document.addEventListener('click', function (event) {

       if (event.target.classList.contains('practice-btn')) {

           const row = event.target.closest('tr');

           const question =
               row?.querySelector('td:first-child')?.textContent?.trim()
               || 'Question';

           showPracticeModal(question);
       }
   });


   function showPracticeModal(question) {

       const existingModal = document.getElementById("practiceModal");

       if (existingModal) {
           existingModal.remove();
       }

       const modal = document.createElement("div");

       modal.id = "practiceModal";

       modal.className =
           "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";

       modal.innerHTML = `
           <div class="bg-surface rounded-xl p-6 w-full max-w-2xl shadow-xl">

               <div class="flex justify-between items-center mb-4">

                   <h3 class="text-xl font-semibold text-on-surface">
                       Practice Question
                   </h3>

                   <button
                       id="closePracticeModal"
                       class="text-on-surface-variant text-xl">
                       ✕
                   </button>

               </div>

               <div class="mb-5">

                   <p class="text-sm text-on-surface-variant mb-2">
                       Question
                   </p>

                   <p class="text-on-surface font-medium">
                       ${question}
                   </p>

               </div>

               <textarea
                   id="practiceAnswer"
                   rows="7"
                   class="w-full p-4 rounded-lg border border-outline-variant bg-surface-container text-on-surface"
                   placeholder="Write your answer here..."
               ></textarea>

               <div class="flex justify-end gap-3 mt-4">

                   <button
                       id="cancelPractice"
                       class="px-4 py-2 rounded-lg border border-outline-variant">
                       Cancel
                   </button>

                   <button
                       id="checkPracticeAnswer"
                       class="px-5 py-2 rounded-lg bg-ai-blue text-white">
                       Check Answer
                   </button>

               </div>

               <div id="practiceResult" class="mt-5"></div>

           </div>
       `;

       document.body.appendChild(modal);


       document.getElementById("closePracticeModal")
           .addEventListener("click", () => modal.remove());

       document.getElementById("cancelPractice")
           .addEventListener("click", () => modal.remove());


       document.getElementById("checkPracticeAnswer")
           .addEventListener("click", async function () {

               const answer =
                   document.getElementById("practiceAnswer").value.trim();

               if (!answer) {
                   alert("Please write your answer first.");
                   return;
               }

               const resultContainer =
                   document.getElementById("practiceResult");

               this.disabled = true;
               this.innerText = "Checking with AI...";

               try {

                   const response = await fetch(
                       `${API_BASE_URL}/api/interview/practice-evaluate`,
                       {
                           method: "POST",

                           headers: {
                               "Content-Type": "application/json",
                               "Authorization": "Bearer " + token
                           },

                           body: JSON.stringify({
                               question: question,
                               answer: answer
                           })
                       }
                   );

                   if (!response.ok) {
                       throw new Error(
                           "Practice evaluation failed: " +
                           response.status
                       );
                   }

                   const result = await response.text();

                   resultContainer.innerHTML = `
                       <div class="p-4 rounded-lg bg-surface-container border border-outline-variant">
                           <h4 class="font-semibold text-on-surface mb-2">
                               AI Evaluation
                           </h4>

                           <pre style="
                               white-space: pre-wrap;
                               font-family: inherit;
                               font-size: 14px;
                               line-height: 1.6;
                               color: inherit;
                           ">${result}</pre>
                       </div>
                   `;

               } catch (error) {

                   console.error(
                       "Practice Evaluation Error:",
                       error
                   );

                   resultContainer.innerHTML = `
                       <p class="text-red-500">
                           Failed to evaluate answer. Please try again.
                       </p>
                   `;

               } finally {

                   this.disabled = false;
                   this.innerText = "Check Answer";
               }
           });
   }

    const questionSearch =
        document.getElementById(
            "questionSearch"
        );


    if (questionSearch) {

        questionSearch.addEventListener(
            "input",
            function () {

                const value =
                    this.value.toLowerCase();


                document
                    .querySelectorAll(
                        "#practiceQuestionsContainer tr"
                    )
                    .forEach(row => {

                        const text =
                            row.innerText.toLowerCase();


                        row.style.display =
                            text.includes(value)
                                ? ""
                                : "none";

                    });

            }
        );
    }

});
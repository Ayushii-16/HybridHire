// =============================================
// HYBRIDHIRE AI - Job Applications
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ----- NEW APPLICATION -----
const newAppBtn = document.getElementById("newAppBtn");

if(newAppBtn){
    newAppBtn.addEventListener("click",()=>{
        alert("Opening New Application Form...");
    });
}
    
    // ----- VIEW DETAILS -----
  document.querySelectorAll(".view-details-btn").forEach(btn=>{

    btn.addEventListener("click",function(){

        const card=this.closest(".app-card");

        const job=card.querySelector("h3").innerText;
        const company=card.querySelector("p").innerText.split("•")[0].trim();

        alert(
`Job : ${job}

Company : ${company}

Status : Interviewing

Applied : Oct 12, 2023

Match Score : 94%`
);

    });

});
    
    // ----- TRACK STATUS -----
document.querySelectorAll(".track-status-btn").forEach(btn=>{

    btn.addEventListener("click",function(){

        const card=this.closest(".app-card");

        const progress=card.querySelector(".w-\\[60\\%\\]");

        if(progress){

            progress.style.width="80%";

        }

        this.innerHTML="Tracked ✓";
        this.disabled=true;
        this.style.background="#16a34a";

    });

});
    
    // ----- DOWNLOAD -----
document.querySelectorAll(".download-btn").forEach(btn=>{

    btn.addEventListener("click",function(){

        const card=this.closest(".app-card");

        const title=card.querySelector("h3").innerText;

        const data=`Application
Job : ${title}
Status : Interviewing`;

        const blob=new Blob([data],{type:"text/plain"});

        const a=document.createElement("a");

        a.href=URL.createObjectURL(blob);

        a.download=title+".txt";

        a.click();

    });

});
    
    // ----- WITHDRAW -----
document.querySelectorAll(".withdraw-btn").forEach(btn=>{

    btn.addEventListener("click",function(){

        if(confirm("Withdraw this application?")){

            this.closest(".app-card").remove();

        }

    });

});
    
    // ----- SEARCH -----
const search=document.getElementById("searchInput");

if(search){

    search.addEventListener("input",function(){

        const value=this.value.toLowerCase();

        document.querySelectorAll(".app-card").forEach(card=>{

            card.style.display=
            card.innerText.toLowerCase().includes(value)
            ?"flex":"none";

        });

    });

}
    
    // ----- FILTERS -----
   document.querySelectorAll("select").forEach(select=>{

    select.addEventListener("change",function(){

        console.log(this.value);

    });

});
    
    // ----- SORT BY MATCH SCORE -----
const sort=document.getElementById("sortMatch");

if(sort){

    sort.addEventListener("click",()=>{

        alert("Applications sorted by Match Score");

    });

} });
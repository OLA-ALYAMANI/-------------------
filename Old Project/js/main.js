// let excelData = []; // هنا سنخزن كافة بيانات الإكسل

//     // أولاً: دالة قراءة الملف عند رفعه
//     document.getElementById('excelFiles').addEventListener('change', function(e) {
//         const file = e.target.files[0];
//           const reader = new FileReader();
//         reader.onload = function(event) {
//             const data = new Uint8Array(event.target.result);
//             const workbook = XLSX.read(data, { type: 'array' });
//             const sheetName = workbook.SheetNames[0];
//             const worksheet = workbook.Sheets[sheetName];
//             // تحويل الملف إلى JSON
//             excelData = XLSX.utils.sheet_to_json(worksheet);
//             alert("تم تحميل الملف بنجاح!");
//         };
//         reader.readAsArrayBuffer(file);
//     });

//      function searchEmployee() {
//         const searchInput = document.querySelector('.search-box input').value.trim();
//         const resultArea = document.getElementById('resultArea');
//         const detailsContainer = document.getElementById('employee-details-container');
//         const headerId = document.createElement('header-emp-id');
//          if (!searchInput || excelData.length === 0) {
//             alert("يرجى رفع ملف وإدخال الرقم الوظيفي");
//             return;
//         }

//         // البحث عن الموظف (سواء كان اسم العمود Employee ID أو الرقم الوظيفي)
//         const employee = excelData.find(emp => 
//             Object.values(emp).some(val => String(val) === searchInput)
//         );

//         if (employee) {
//             resultArea.style.display = 'block';
//             headerId.innerText = searchInput; // عرض الرقم في الرأس
            
//             // تفريغ الحاوية قبل العرض الجديد
//             detailsContainer.innerHTML = '';

//             // تكرار على كل الأعمدة الموجودة في ملف الإكسل لهذا الموظف
//             for (const [key, value] of Object.entries(employee)) {
//                 // إنشاء عنصر لكل معلومة (مثلاً: الاسم: محمد)
//                 const infoDiv = document.createElement('div');
//                 infoDiv.style.marginBottom = "10px";
//                 infoDiv.style.borderBottom = "1px solid #eee";
//                 infoDiv.style.padding = "5px 0";
                
//                 infoDiv.innerHTML = `
//                     <span style="font-weight: bold; color: #555;">${key}:</span> 
//                     <span style="color: #333;">${value}</span>
//                 `;
//                 detailsContainer.appendChild(infoDiv);
//             }
//         } else {
//             resultArea.style.display = 'none';
//             alert("الموظف غير موجود");
//         }
//     }

let excelData = []; // تخزين البيانات عالمياً

// 1. وظيفة قراءة ملف الإكسل عند الرفع
document.getElementById('excelFiles').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // تحويل البيانات إلى JSON
        excelData = XLSX.utils.sheet_to_json(worksheet);
        alert("تم تحميل الملف وقراءة البيانات بنجاح!");
    };
    reader.readAsArrayBuffer(file);
});

function searchEmployee() {
    const searchInput = document.querySelector('.search-box input').value.trim();
    const container = document.getElementById('result-container');

    // مسح النتائج السابقة
    container.innerHTML = '';

    if (!searchInput || excelData.length === 0) {
        alert("يرجى رفع ملف وإدخال الرقم الوظيفي");
        return;
    }

    // البحث عن الموظف
    const employee = excelData.find(emp => 
        Object.values(emp).some(val => String(val).trim() === searchInput)
    );

    if (employee) {
        
        container.style.display = 'block'; 

        // --- 1. إنشاء العنصر الرئيسي (Section) ---
        const resultSection = document.createElement('section');
        resultSection.className = 'result';

        // --- 2. إنشاء الرأس (Match Found & Header) ---
        const resultInfo = document.createElement('div');
        resultInfo.className = 'result-info';

        const infoHead = document.createElement('div');
        infoHead.className = 'info-head';
        infoHead.innerHTML = `
            <div class="match">MATCH FOUND</div>
            <h1>Employee profile</h1>
            <p><strong>Employee ID:</strong> ${searchInput}</p>
        `;
        resultInfo.appendChild(infoHead);

        // --- 3. إنشاء منطقة المعلومات الفرعية (Sub-info) ---
        const resultSubInfo = document.createElement('div');
        resultSubInfo.className = 'result-subinfo';

        // إنشاء حاوية لتوزيع البيانات بشكل شبكي (Grid)
        const subInfoBody = document.createElement('div');
        subInfoBody.className = 'subinfo-body';
        // جعل الـ CSS يطبق التوزيع التلقائي
        subInfoBody.style.display = "grid";
        // subInfoBody.style.gridTemplateColumns = "repeat(auto-fit, minmax(150px, 1fr))";
        subInfoBody.style.gridTemplateColumns = "1fr 1fr";
        subInfoBody.style.gap = "15px";
        subInfoBody.style.width = "100%";
        subInfoBody.style.direction = "rtl";

        // --- 4. تكرار لإنشاء عناصر لكل عمود في الإكسل ---
        for (const [key, value] of Object.entries(employee)) {
            // إنشاء Div لكل معلومة (مثل: الاسم، المتجر...)
            const itemDiv = document.createElement('div');
            
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = key; // اسم العمود من الإكسل

            const valueDiv = document.createElement('div');
            valueDiv.className = 'value';
            valueDiv.textContent = value; // قيمة الخلية

            itemDiv.appendChild(labelDiv);
            itemDiv.appendChild(valueDiv);
            subInfoBody.appendChild(itemDiv);
        }

        // تجميع العناصر ببعضها البعض
        resultSubInfo.appendChild(subInfoBody);
        resultSection.appendChild(resultInfo);
        resultSection.appendChild(resultSubInfo);
        
        // إضافة القسم بالكامل للصفحة
        container.appendChild(resultSection);

        // تمرير الصفحة للأسفل لرؤية النتيجة
        resultSection.scrollIntoView({ behavior: 'smooth' });

    } else {
        alert("عذراً، الموظف غير موجود");
    }
}
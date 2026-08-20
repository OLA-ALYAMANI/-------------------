let excelData = [];

// معالجة رفع ملف واحد
document.getElementById('excelFiles').addEventListener('change', function (e) {
  const file = e.target.files[0];
  const statusElement = document.getElementById('fileStatus');

  if (!file) return;

  excelData = [];
  statusElement.textContent = 'جاري معالجة الملف...';

  const reader = new FileReader();

  reader.onload = function (evt) {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // تحويل البيانات إلى JSON
      excelData = XLSX.utils.sheet_to_json(worksheet);

      // إضافة مصدر البيانات (اسم الملف)
    //   excelData = excelData.map(row => ({
    //     ...row,
    //     '_مصدر_الملف': file.name
    //   }));

      statusElement.style.color = 'green';
      statusElement.textContent = `تم تحميل الملف بنجاح! إجمالي الموظفين: ${excelData.length}`;
    } catch (err) {
      statusElement.style.color = 'red';
      statusElement.textContent = 'حدث خطأ أثناء قراءة الملف.';
      console.error(err);
    }
  };

  reader.onerror = () => {
    statusElement.style.color = 'red';
    statusElement.textContent = 'خطأ في قراءة الملف.';
  };

  reader.readAsArrayBuffer(file);
});

// دالة البحث
// function searchEmployee() {
//   const inputId = document.getElementById('empIdInput').value.trim();
//   const resultDiv = document.getElementById('resultArea');
//   resultDiv.innerHTML = '';

//   if (!excelData || excelData.length === 0) {
//     alert('يرجى اختيار ملف Excel أولاً.');
//     return;
//   }
//   if (!inputId) {
//     alert('يرجى إدخال الرقم الوظيفي.');
//     return;
//   }

//   const matches = excelData.filter((row) => {
//     const idValue = row['Employee ID'] || row['EmployeeID'] || row['الرقم الوظيفي'] || row['رقم الموظف'];
//     return String(idValue || '').trim() === inputId;
//   });

//   if (matches.length > 0) {
//     let html = `<div class="result-title">تم العثور على (${matches.length}) نتيجة:</div>`;
//     matches.forEach((employee, index) => {
//       html += `
//         <div class="result-source">نتيجة #${index + 1} — المصدر: ${employee['_مصدر_الملف']}</div>
//         <table class="results-table">
//           <thead>
//             <tr>
//               <th>الخاصية</th>
//               <th>التفاصيل</th>
//             </tr>
//           </thead>
//           <tbody>
//       `;
//       for (const [key, value] of Object.entries(employee)) {
//         if (key !== '_مصدر_الملف') {
//           html += `
//             <tr>
//               <td>${key}</td>
//               <td>${value ?? '-'}</td>
//             </tr>
//           `;
//         }
//       }
//       html += `
//           </tbody>
//         </table>
//       `;
//     });
//     resultDiv.innerHTML = html;
//   } else {
//     resultDiv.innerHTML = 'لم يتم العثور على موظف بهذا الرقم في الملف المرفوع.';
//   }
// }

function searchEmployee() {
  const inputId = document.getElementById('empIdInput').value.trim();
  const resultDiv = document.getElementById('resultArea');
  resultDiv.innerHTML = '';

  if (!excelData || excelData.length === 0) {
    alert('يرجى رفع ملف Excel أولاً.');
    return;
  }

  if (!inputId) {
    alert('يرجى إدخال الرقم الوظيفي.');
    return;
  }

  const matches = excelData.filter((row) => {
    const idValue = row['Employee ID'] || row['EmployeeID'] || row['الرقم الوظيفي'] || row['رقم الموظف'];
    return String(idValue || '').trim() === inputId;
  });

  if (matches.length > 0 || matches.length == 1) {
    // إنشاء جدول واحد للنتائج
    let html = `
      <table class="results-table" border="1" cellpadding="5" cellspacing="0">
        <thead>
        </thead>
        <tbody>
    `;

    matches.forEach((employee, index) => {
    //   html += `
    //     <tr>
    //       <td>${index + 1}</td>
    //       <td>${employee['_مصدر_الملف']}</td>
    //       <td>
    //         <table style="width: 100%; border-collapse: collapse;">
    //           <tbody>
    //   `;
      for (const [key, value] of Object.entries(employee)) {
        if (key !== '_مصدر_الملف') {
          html += `
            <tr>
              <td style="border: 1px solid #ccc; padding: 4px; font-weight: bold;">${key}</td>
              <td style="border: 1px solid #ccc; padding: 4px;">${value ?? '-'}</td>
            </tr>
          `;
        }
      }
      html += `
              </tbody>
            </table>
          </td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    resultDiv.innerHTML = html;
  } else {
    resultDiv.innerHTML = 'لم يتم العثور على موظف بهذا الرقم في الملف المرفوع.';
  }
}

// function displayResultsInGrid(matches) {
//   const gridContainer = document.getElementById('gridContainer');
//   gridContainer.innerHTML = '';

//   if (matches.length === 0) {
//     gridContainer.innerHTML = 'لم يتم العثور على نتائج.';
//     return;
//   }

//   // نحصل على جميع البيانات من أول نتيجة
//   const firstEmployee = matches[0];

//   // إنشاء رأس الأعمدة (العناوين)
//   const headers = Object.keys(firstEmployee);

//   // بناء مصفوفة البيانات: العناوين ثم البيانات لكل موظف
//   let data = [];

//   // أضف العناوين
//   headers.forEach(header => {
//     data.push(header);
//   });

//   // أضف البيانات لكل موظف
//   matches.forEach(emp => {
//     headers.forEach(header => {
//       data.push(emp[header] ?? '-');
//     });
//   });

//   // تحديد عدد الأعمدة
//   const cols = headers.length;

//   // ضبط شبكة الـ Grid
//   gridContainer.style.display = 'grid';
//   gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

//   // إنشاء خلايا الشبكة
//   gridContainer.innerHTML = data
//     .map(item => `<div class="cell" style="border: 1px solid #ccc; padding: 4px;">${item}</div>`)
//     .join('');
// }
let combinedExcelData = [];

// معالجة رفع ملفات متعددة
document.getElementById('excelFiles').addEventListener('change', async function (e) {
  const files = e.target.files;
  const statusElement = document.getElementById('fileStatus');
  
  if (!files.length) return;

  combinedExcelData = []; // إعادة تعيين البيانات
  statusElement.textContent = 'جاري معالجة الملفات...';

  const filePromises = Array.from(files).map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = function (evt) {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // تحويل البيانات إلى JSON
          const sheetJson = XLSX.utils.sheet_to_json(worksheet);
          
          // إضافة اسم الملف لكل موظف ليعرف المستخدم مصدر المعلومة
          const rowsWithSource = sheetJson.map(row => ({
            ...row,
            '_مصدر_الملف': file.name
          }));

          resolve(rowsWithSource);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  });

  try {
    // الانتظار حتى تنتهي قراءة جميع الملفات
    const results = await Promise.all(filePromises);
    
    // دمج كافة الصفوف في مصفوفة واحدة
    combinedExcelData = results.flat();
    
    statusElement.style.color = 'green';
    statusElement.textContent = `تم تحميل ${files.length} ملف(ات) بنجاح! إجمالي الموظفين: ${combinedExcelData.length}`;
  } catch (error) {
    statusElement.style.color = 'red';
    statusElement.textContent = 'حدث خطأ أثناء قراءة بعض الملفات.';
    console.error(error);
  }
});

// دالة البحث
function searchEmployee() {
  const inputId = document.getElementById('empIdInput').value.trim();
  const resultDiv = document.getElementById('resultArea');
  resultDiv.innerHTML = '';

  if (!combinedExcelData.length) {
    alert('يرجى اختيار ملفات Excel أولاً.');
    return;

  if (!inputId) {
    alert('يرجى إدخال الرقم الوظيفي.');
    return;
  }

  // البحث عن كل السجلات المطبقة (في حال كان الموظف موجوداً في أكثر من ملف)
  const matches = combinedExcelData.filter((row) => {
    const idValue = row['Employee ID'] || row['EmployeeID'] || row['الرقم الوظيفي'] || row['رقم الموظف'];
    return String(idValue || '').trim() === inputId;
  });

  if (matches.length > 0) {
  //   let html = `تم العثور على (${matches.length}) نتيجة:`;

  //   matches.forEach((employee, index) => {
  //     html += ``;
  //     html += `نتيجة #${index + 1} (المصدر: ${employee['_مصدر_الملف']})`;
  //     html += '';
      
  //     for (const [key, value] of Object.entries(employee)) {
  //       if (key !== '_مصدر_الملف') {
  //         html += ``;
  //       }
  //     }
      
  //     html += 'الخاصيةالتفاصيل${key}${value ?? '-'}';
  //   });

  //   resultDiv.innerHTML = html;
  // } else {
  //   resultDiv.innerHTML = 'لم يتم العثور على موظف بهذا الرقم في الملفات المرفوعة.';
  // }
    let html = `<div class="result-title">تم العثور على (${matches.length}) نتيجة:</div>`;
    
      matches.forEach((employee, index) => {
    html += `
      // <div class="result-source">نتيجة #${index + 1} — المصدر: ${employee['_مصدر_الملف']}</div>
      <table class="results-table">
        <thead>
          <tr>
            <th>الخاصية</th>
            <th>التفاصيل</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (const [key, value] of Object.entries(employee)) {
      if (key !== '_مصدر_الملف') {
        html += `
          <tr>
            <td>${key}</td>
            <td>${value ?? '-'}</td>
          </tr>
        `;
      }
    }

    html += `
        </tbody>
      </table>
    `;
  });

  resultDiv.innerHTML = html;
  } else {
  resultDiv.innerHTML = 'لم يتم العثور على موظف بهذا الرقم في الملفات المرفوعة.';

  }
  }
}
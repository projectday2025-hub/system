// Fungsi doPost menerima permintaan dari GitHub Pages
function doPost(e) {
  // Jika tidak ada data, kembalikan error
  if (!e || !e.postData || !e.postData.contents) {
    return responseJSON({ status: "error", pesan: "Tidak ada data yang diterima" });
  }

  // Parse data yang dikirim dari GitHub
  var request = JSON.parse(e.postData.contents);
  var action = request.action;

  // Rute logika berdasarkan aksi yang diminta
  if (action === "login") {
    return prosesLogin(request.username, request.password);
  } else if (action === "simpanPasien") {
    return simpanDataPasien(request.data);
  } else if (action === "getPasien") {
    return getDataPasien();
  }

  return responseJSON({ status: "error", pesan: "Aksi tidak dikenali" });
}

// Fungsi get (Opsional) hanya untuk mengecek apakah API aktif jika link dibuka langsung
function doGet(e) {
  return ContentService.createTextOutput("API FATH Aktif dan Berjalan!").setMimeType(ContentService.MimeType.TEXT);
}

// ---------------- LOGIKA APLIKASI ----------------

function cekLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Jika username dan password benar
    if (username === "admin" && password === "12345") {
        alert("Login Berhasil!");
        
        // Maksud instruksinya adalah menambahkan baris ini di sini:
        window.location.href = "fath.html"; 
        
    } else {
        alert("Username atau Password salah!");
    }
}

function simpanDataPasien(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data_Pasien");
  sheet.appendRow([
    new Date(), data.noRM, data.nama, data.kecamatan, 
    data.lat, data.lng, data.diagnosis, data.icd10
  ]);
  return responseJSON({ status: "sukses", pesan: "Data Pasien Berhasil Disimpan!" });
}

function getDataPasien() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data_Pasien");
  var data = sheet.getDataRange().getValues();
  var result = [];
  
  for(var i = 1; i < data.length; i++) {
    result.push({
      tanggal: data[i][0], noRM: data[i][1], nama: data[i][2],
      kecamatan: data[i][3], lat: data[i][4], lng: data[i][5],
      diagnosis: data[i][6], icd10: data[i][7]
    });
  }
  return responseJSON({ status: "sukses", data: result });
}

// Fungsi pembantu untuk mengemas respon ke format JSON
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

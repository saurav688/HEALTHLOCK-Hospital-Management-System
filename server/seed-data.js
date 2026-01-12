import mongoose from "mongoose";
import dotenv from "dotenv";
import Patient from "./src/models/Patient.js";
import Doctor from "./src/models/Doctor.js";
import Room from "./src/models/Room.js";
import Department from "./src/models/Department.js";
import Admission from "./src/models/Admission.js";
import Operation from "./src/models/Operation.js";
import Checkup from "./src/models/Checkup.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/healthlock";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Patient.deleteMany({}),
      Doctor.deleteMany({}),
      Room.deleteMany({}),
      Department.deleteMany({}),
      Admission.deleteMany({}),
      Operation.deleteMany({}),
      Checkup.deleteMany({})
    ]);

    // Create Departments (Expanded)
    const departments = await Department.insertMany([
      { 
        name: "Cardiology", 
        description: "Heart and cardiovascular care",
        location: "Building A, Floor 2",
        facilities: "ECG, Echo, Cath Lab, Stress Testing, Holter Monitoring"
      },
      { 
        name: "Neurology", 
        description: "Brain and nervous system care",
        location: "Building B, Floor 3",
        facilities: "MRI, CT Scan, EEG, EMG, Sleep Study Lab"
      },
      { 
        name: "Orthopedics", 
        description: "Bone and joint care",
        location: "Building A, Floor 1",
        facilities: "X-Ray, Physiotherapy, Joint Replacement, Sports Medicine"
      },
      { 
        name: "Pediatrics", 
        description: "Children's healthcare",
        location: "Building C, Floor 1",
        facilities: "Pediatric ICU, Vaccination, Growth Monitoring, Play Therapy"
      },
      { 
        name: "Emergency", 
        description: "Emergency medical care",
        location: "Ground Floor, Main Building",
        facilities: "Trauma Bay, Resuscitation, Ambulance Bay, Fast Track"
      },
      { 
        name: "Oncology", 
        description: "Cancer treatment and care",
        location: "Building D, Floor 2",
        facilities: "Chemotherapy Suite, Radiation Therapy, Oncology Pharmacy"
      },
      { 
        name: "Gastroenterology", 
        description: "Digestive system care",
        location: "Building B, Floor 1",
        facilities: "Endoscopy Suite, Colonoscopy, Upper GI Studies"
      },
      { 
        name: "Pulmonology", 
        description: "Respiratory system care",
        location: "Building A, Floor 3",
        facilities: "Pulmonary Function Lab, Bronchoscopy, Sleep Apnea Clinic"
      },
      { 
        name: "Dermatology", 
        description: "Skin and cosmetic care",
        location: "Building C, Floor 2",
        facilities: "Dermatoscopy, Laser Therapy, Cosmetic Surgery"
      },
      { 
        name: "Psychiatry", 
        description: "Mental health care",
        location: "Building D, Floor 1",
        facilities: "Counseling Rooms, Group Therapy, Psychiatric Assessment"
      },
      { 
        name: "Obstetrics & Gynecology", 
        description: "Women's health and maternity care",
        location: "Building C, Floor 3",
        facilities: "Labor & Delivery, NICU, Ultrasound, Mammography"
      },
      { 
        name: "Urology", 
        description: "Urinary system and male reproductive health",
        location: "Building B, Floor 2",
        facilities: "Lithotripsy, Cystoscopy, Urodynamics"
      }
    ]);

    // Create Doctors (Significantly Expanded)
    const doctors = await Doctor.insertMany([
      // Cardiology
      { name: "Dr. Sarah Johnson", specialization: "Cardiology", department: "Cardiology", phone: "555-0101", email: "sarah.johnson@healthlock.com" },
      { name: "Dr. Michael Rodriguez", specialization: "Interventional Cardiology", department: "Cardiology", phone: "555-0102", email: "michael.rodriguez@healthlock.com" },
      { name: "Dr. Amanda Chen", specialization: "Cardiac Surgery", department: "Cardiology", phone: "555-0103", email: "amanda.chen@healthlock.com" },
      
      // Neurology
      { name: "Dr. Michael Chen", specialization: "Neurology", department: "Neurology", phone: "555-0201", email: "michael.chen@healthlock.com" },
      { name: "Dr. Jennifer Park", specialization: "Neurosurgery", department: "Neurology", phone: "555-0202", email: "jennifer.park@healthlock.com" },
      { name: "Dr. Robert Kim", specialization: "Pediatric Neurology", department: "Neurology", phone: "555-0203", email: "robert.kim@healthlock.com" },
      
      // Orthopedics
      { name: "Dr. Emily Rodriguez", specialization: "Orthopedics", department: "Orthopedics", phone: "555-0301", email: "emily.rodriguez@healthlock.com" },
      { name: "Dr. James Wilson", specialization: "Sports Medicine", department: "Orthopedics", phone: "555-0302", email: "james.wilson@healthlock.com" },
      { name: "Dr. Lisa Thompson", specialization: "Spine Surgery", department: "Orthopedics", phone: "555-0303", email: "lisa.thompson@healthlock.com" },
      
      // Pediatrics
      { name: "Dr. David Kim", specialization: "Pediatrics", department: "Pediatrics", phone: "555-0401", email: "david.kim@healthlock.com" },
      { name: "Dr. Maria Garcia", specialization: "Pediatric Cardiology", department: "Pediatrics", phone: "555-0402", email: "maria.garcia@healthlock.com" },
      { name: "Dr. Thomas Lee", specialization: "Neonatology", department: "Pediatrics", phone: "555-0403", email: "thomas.lee@healthlock.com" },
      
      // Emergency
      { name: "Dr. Lisa Thompson", specialization: "Emergency Medicine", department: "Emergency", phone: "555-0501", email: "lisa.thompson.em@healthlock.com" },
      { name: "Dr. Kevin Brown", specialization: "Trauma Surgery", department: "Emergency", phone: "555-0502", email: "kevin.brown@healthlock.com" },
      { name: "Dr. Rachel Davis", specialization: "Emergency Medicine", department: "Emergency", phone: "555-0503", email: "rachel.davis@healthlock.com" },
      
      // Oncology
      { name: "Dr. Steven Miller", specialization: "Medical Oncology", department: "Oncology", phone: "555-0601", email: "steven.miller@healthlock.com" },
      { name: "Dr. Patricia White", specialization: "Radiation Oncology", department: "Oncology", phone: "555-0602", email: "patricia.white@healthlock.com" },
      { name: "Dr. Daniel Johnson", specialization: "Surgical Oncology", department: "Oncology", phone: "555-0603", email: "daniel.johnson@healthlock.com" },
      
      // Gastroenterology
      { name: "Dr. Nancy Anderson", specialization: "Gastroenterology", department: "Gastroenterology", phone: "555-0701", email: "nancy.anderson@healthlock.com" },
      { name: "Dr. Christopher Taylor", specialization: "Hepatology", department: "Gastroenterology", phone: "555-0702", email: "christopher.taylor@healthlock.com" },
      
      // Pulmonology
      { name: "Dr. Michelle Martinez", specialization: "Pulmonology", department: "Pulmonology", phone: "555-0801", email: "michelle.martinez@healthlock.com" },
      { name: "Dr. Andrew Wilson", specialization: "Critical Care", department: "Pulmonology", phone: "555-0802", email: "andrew.wilson@healthlock.com" },
      
      // Dermatology
      { name: "Dr. Jessica Moore", specialization: "Dermatology", department: "Dermatology", phone: "555-0901", email: "jessica.moore@healthlock.com" },
      { name: "Dr. Brian Clark", specialization: "Dermatopathology", department: "Dermatology", phone: "555-0902", email: "brian.clark@healthlock.com" },
      
      // Psychiatry
      { name: "Dr. Karen Lewis", specialization: "Psychiatry", department: "Psychiatry", phone: "555-1001", email: "karen.lewis@healthlock.com" },
      { name: "Dr. Mark Robinson", specialization: "Child Psychiatry", department: "Psychiatry", phone: "555-1002", email: "mark.robinson@healthlock.com" },
      
      // OB/GYN
      { name: "Dr. Susan Walker", specialization: "Obstetrics & Gynecology", department: "Obstetrics & Gynecology", phone: "555-1101", email: "susan.walker@healthlock.com" },
      { name: "Dr. Jennifer Hall", specialization: "Maternal-Fetal Medicine", department: "Obstetrics & Gynecology", phone: "555-1102", email: "jennifer.hall@healthlock.com" },
      
      // Urology
      { name: "Dr. Robert Wilson", specialization: "Urology", department: "Urology", phone: "555-1201", email: "robert.wilson@healthlock.com" },
      { name: "Dr. Paul Young", specialization: "Pediatric Urology", department: "Urology", phone: "555-1202", email: "paul.young@healthlock.com" }
    ]);

    // Create Rooms (Expanded)
    const rooms = await Room.insertMany([
      // General Rooms
      { roomNo: "101", type: "General", status: "Available", dailyCharge: 150 },
      { roomNo: "102", type: "General", status: "Occupied", dailyCharge: 150 },
      { roomNo: "103", type: "General", status: "Available", dailyCharge: 150 },
      { roomNo: "104", type: "General", status: "Occupied", dailyCharge: 150 },
      { roomNo: "105", type: "General", status: "Available", dailyCharge: 150 },
      { roomNo: "106", type: "General", status: "Maintenance", dailyCharge: 150 },
      { roomNo: "107", type: "General", status: "Available", dailyCharge: 150 },
      { roomNo: "108", type: "General", status: "Available", dailyCharge: 150 },
      
      // Private Rooms
      { roomNo: "201", type: "Private", status: "Available", dailyCharge: 250 },
      { roomNo: "202", type: "Private", status: "Occupied", dailyCharge: 250 },
      { roomNo: "203", type: "Private", status: "Available", dailyCharge: 250 },
      { roomNo: "204", type: "Private", status: "Occupied", dailyCharge: 250 },
      { roomNo: "205", type: "Private", status: "Available", dailyCharge: 250 },
      { roomNo: "206", type: "Private", status: "Available", dailyCharge: 250 },
      { roomNo: "207", type: "Private", status: "Occupied", dailyCharge: 250 },
      { roomNo: "208", type: "Private", status: "Available", dailyCharge: 250 },
      
      // ICU Rooms
      { roomNo: "301", type: "ICU", status: "Available", dailyCharge: 500 },
      { roomNo: "302", type: "ICU", status: "Occupied", dailyCharge: 500 },
      { roomNo: "303", type: "ICU", status: "Available", dailyCharge: 500 },
      { roomNo: "304", type: "ICU", status: "Occupied", dailyCharge: 500 },
      { roomNo: "305", type: "ICU", status: "Available", dailyCharge: 500 },
      { roomNo: "306", type: "ICU", status: "Available", dailyCharge: 500 },
      
      // Surgery Rooms
      { roomNo: "401", type: "Surgery", status: "Available", dailyCharge: 800 },
      { roomNo: "402", type: "Surgery", status: "Available", dailyCharge: 800 },
      { roomNo: "403", type: "Surgery", status: "In Use", dailyCharge: 800 },
      { roomNo: "404", type: "Surgery", status: "Available", dailyCharge: 800 },
      { roomNo: "405", type: "Surgery", status: "Available", dailyCharge: 800 },
      
      // Maternity Rooms
      { roomNo: "501", type: "Maternity", status: "Available", dailyCharge: 300 },
      { roomNo: "502", type: "Maternity", status: "Occupied", dailyCharge: 300 },
      { roomNo: "503", type: "Maternity", status: "Available", dailyCharge: 300 },
      { roomNo: "504", type: "Maternity", status: "Available", dailyCharge: 300 },
      { roomNo: "505", type: "Maternity", status: "Occupied", dailyCharge: 300 },
      
      // Emergency Rooms
      { roomNo: "ER1", type: "Emergency", status: "Available", dailyCharge: 200 },
      { roomNo: "ER2", type: "Emergency", status: "In Use", dailyCharge: 200 },
      { roomNo: "ER3", type: "Emergency", status: "Available", dailyCharge: 200 },
      { roomNo: "ER4", type: "Emergency", status: "Available", dailyCharge: 200 },
      { roomNo: "ER5", type: "Emergency", status: "In Use", dailyCharge: 200 }
    ]);

    // Create Patients (Significantly Expanded)
    const patients = await Patient.insertMany([
      // Cardiology Patients
      { name: "John Smith", age: 45, gender: "Male", phone: "555-1001", address: "123 Main St, Springfield", department: "Cardiology", doctor: "Dr. Sarah Johnson", bloodGroup: "O+", emergencyContact: "Jane Smith - 555-1002" },
      { name: "Robert Johnson", age: 62, gender: "Male", phone: "555-1003", address: "456 Oak Ave, Springfield", department: "Cardiology", doctor: "Dr. Michael Rodriguez", bloodGroup: "A+", emergencyContact: "Mary Johnson - 555-1004" },
      { name: "William Davis", age: 58, gender: "Male", phone: "555-1005", address: "789 Pine St, Springfield", department: "Cardiology", doctor: "Dr. Amanda Chen", bloodGroup: "B+", emergencyContact: "Linda Davis - 555-1006" },
      
      // Neurology Patients
      { name: "Mary Johnson", age: 32, gender: "Female", phone: "555-1007", address: "321 Elm St, Springfield", department: "Neurology", doctor: "Dr. Michael Chen", bloodGroup: "AB+", emergencyContact: "Tom Johnson - 555-1008" },
      { name: "Patricia Wilson", age: 41, gender: "Female", phone: "555-1009", address: "654 Maple Ave, Springfield", department: "Neurology", doctor: "Dr. Jennifer Park", bloodGroup: "O-", emergencyContact: "James Wilson - 555-1010" },
      { name: "Jennifer Brown", age: 29, gender: "Female", phone: "555-1011", address: "987 Cedar St, Springfield", department: "Neurology", doctor: "Dr. Robert Kim", bloodGroup: "A-", emergencyContact: "Michael Brown - 555-1012" },
      
      // Orthopedics Patients
      { name: "Robert Brown", age: 28, gender: "Male", phone: "555-1013", address: "147 Birch St, Springfield", department: "Orthopedics", doctor: "Dr. Emily Rodriguez", bloodGroup: "B-", emergencyContact: "Sarah Brown - 555-1014" },
      { name: "Michael Miller", age: 35, gender: "Male", phone: "555-1015", address: "258 Spruce Ave, Springfield", department: "Orthopedics", doctor: "Dr. James Wilson", bloodGroup: "AB-", emergencyContact: "Lisa Miller - 555-1016" },
      { name: "David Anderson", age: 42, gender: "Male", phone: "555-1017", address: "369 Walnut St, Springfield", department: "Orthopedics", doctor: "Dr. Lisa Thompson", bloodGroup: "O+", emergencyContact: "Karen Anderson - 555-1018" },
      
      // Pediatrics Patients
      { name: "Emma Thompson", age: 8, gender: "Female", phone: "555-1019", address: "741 Cherry Lane, Springfield", department: "Pediatrics", doctor: "Dr. David Kim", bloodGroup: "A+", emergencyContact: "Susan Thompson - 555-1020" },
      { name: "Noah Garcia", age: 12, gender: "Male", phone: "555-1021", address: "852 Peach St, Springfield", department: "Pediatrics", doctor: "Dr. Maria Garcia", bloodGroup: "B+", emergencyContact: "Carlos Garcia - 555-1022" },
      { name: "Olivia Lee", age: 5, gender: "Female", phone: "555-1023", address: "963 Apple Ave, Springfield", department: "Pediatrics", doctor: "Dr. Thomas Lee", bloodGroup: "O+", emergencyContact: "Helen Lee - 555-1024" },
      
      // Emergency Patients
      { name: "James Taylor", age: 33, gender: "Male", phone: "555-1025", address: "159 Orange St, Springfield", department: "Emergency", doctor: "Dr. Lisa Thompson", bloodGroup: "AB+", emergencyContact: "Amy Taylor - 555-1026" },
      { name: "Linda Martinez", age: 27, gender: "Female", phone: "555-1027", address: "357 Grape Ave, Springfield", department: "Emergency", doctor: "Dr. Kevin Brown", bloodGroup: "A-", emergencyContact: "Jose Martinez - 555-1028" },
      { name: "Christopher White", age: 39, gender: "Male", phone: "555-1029", address: "468 Banana St, Springfield", department: "Emergency", doctor: "Dr. Rachel Davis", bloodGroup: "B+", emergencyContact: "Michelle White - 555-1030" },
      
      // Oncology Patients
      { name: "Susan Miller", age: 54, gender: "Female", phone: "555-1031", address: "579 Lemon Lane, Springfield", department: "Oncology", doctor: "Dr. Steven Miller", bloodGroup: "O-", emergencyContact: "Robert Miller - 555-1032" },
      { name: "Daniel Clark", age: 48, gender: "Male", phone: "555-1033", address: "680 Lime St, Springfield", department: "Oncology", doctor: "Dr. Patricia White", bloodGroup: "A+", emergencyContact: "Nancy Clark - 555-1034" },
      { name: "Karen Lewis", age: 61, gender: "Female", phone: "555-1035", address: "791 Coconut Ave, Springfield", department: "Oncology", doctor: "Dr. Daniel Johnson", bloodGroup: "B-", emergencyContact: "Paul Lewis - 555-1036" },
      
      // Gastroenterology Patients
      { name: "Mark Robinson", age: 44, gender: "Male", phone: "555-1037", address: "802 Mango St, Springfield", department: "Gastroenterology", doctor: "Dr. Nancy Anderson", bloodGroup: "AB+", emergencyContact: "Jennifer Robinson - 555-1038" },
      { name: "Lisa Walker", age: 36, gender: "Female", phone: "555-1039", address: "913 Pineapple Lane, Springfield", department: "Gastroenterology", doctor: "Dr. Christopher Taylor", bloodGroup: "O+", emergencyContact: "Steven Walker - 555-1040" },
      
      // Pulmonology Patients
      { name: "Paul Young", age: 52, gender: "Male", phone: "555-1041", address: "024 Strawberry Ave, Springfield", department: "Pulmonology", doctor: "Dr. Michelle Martinez", bloodGroup: "A-", emergencyContact: "Carol Young - 555-1042" },
      { name: "Nancy Hall", age: 47, gender: "Female", phone: "555-1043", address: "135 Blueberry St, Springfield", department: "Pulmonology", doctor: "Dr. Andrew Wilson", bloodGroup: "B+", emergencyContact: "Richard Hall - 555-1044" },
      
      // Dermatology Patients
      { name: "Brian Allen", age: 31, gender: "Male", phone: "555-1045", address: "246 Raspberry Lane, Springfield", department: "Dermatology", doctor: "Dr. Jessica Moore", bloodGroup: "AB-", emergencyContact: "Amanda Allen - 555-1046" },
      { name: "Amanda King", age: 26, gender: "Female", phone: "555-1047", address: "357 Blackberry Ave, Springfield", department: "Dermatology", doctor: "Dr. Brian Clark", bloodGroup: "O+", emergencyContact: "Kevin King - 555-1048" },
      
      // Psychiatry Patients
      { name: "Kevin Wright", age: 38, gender: "Male", phone: "555-1049", address: "468 Cranberry St, Springfield", department: "Psychiatry", doctor: "Dr. Karen Lewis", bloodGroup: "A+", emergencyContact: "Sarah Wright - 555-1050" },
      { name: "Sarah Green", age: 24, gender: "Female", phone: "555-1051", address: "579 Gooseberry Lane, Springfield", department: "Psychiatry", doctor: "Dr. Mark Robinson", bloodGroup: "B-", emergencyContact: "David Green - 555-1052" },
      
      // OB/GYN Patients
      { name: "Michelle Adams", age: 30, gender: "Female", phone: "555-1053", address: "680 Elderberry Ave, Springfield", department: "Obstetrics & Gynecology", doctor: "Dr. Susan Walker", bloodGroup: "AB+", emergencyContact: "Thomas Adams - 555-1054" },
      { name: "Jennifer Baker", age: 28, gender: "Female", phone: "555-1055", address: "791 Mulberry St, Springfield", department: "Obstetrics & Gynecology", doctor: "Dr. Jennifer Hall", bloodGroup: "O-", emergencyContact: "Christopher Baker - 555-1056" },
      
      // Urology Patients
      { name: "Thomas Nelson", age: 55, gender: "Male", phone: "555-1057", address: "802 Boysenberry Lane, Springfield", department: "Urology", doctor: "Dr. Robert Wilson", bloodGroup: "A-", emergencyContact: "Patricia Nelson - 555-1058" },
      { name: "Richard Carter", age: 49, gender: "Male", phone: "555-1059", address: "913 Huckleberry Ave, Springfield", department: "Urology", doctor: "Dr. Paul Young", bloodGroup: "B+", emergencyContact: "Linda Carter - 555-1060" }
    ]);

    // Create Admissions (Expanded)
    const admissions = await Admission.insertMany([
      { 
        patient: patients[0]._id, 
        doctor: doctors[0]._id, 
        room: rooms[1]._id, 
        admissionDate: new Date(), 
        reason: "Chest pain evaluation and cardiac monitoring",
        status: "Admitted",
        attendantName: "Jane Smith",
        condition: "Stable with chest pain",
        investigation: "ECG, Cardiac enzymes, Chest X-ray",
        advancePayment: 2000,
        paymentMode: "Insurance"
      },
      { 
        patient: patients[3]._id, 
        doctor: doctors[3]._id, 
        room: rooms[17]._id, 
        admissionDate: new Date(Date.now() - 24 * 60 * 60 * 1000), 
        reason: "Severe headache and neurological assessment",
        status: "Admitted",
        attendantName: "Tom Johnson",
        condition: "Alert and oriented, severe headache",
        investigation: "MRI brain, CT scan, Blood work",
        advancePayment: 3000,
        paymentMode: "Cash"
      },
      { 
        patient: patients[6]._id, 
        doctor: doctors[6]._id, 
        room: rooms[9]._id, 
        admissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
        reason: "Pre-operative admission for knee surgery",
        status: "Admitted",
        attendantName: "Sarah Brown",
        condition: "Stable, preparing for surgery",
        investigation: "Pre-op labs, X-ray knee, Anesthesia consult",
        advancePayment: 5000,
        paymentMode: "Card"
      },
      { 
        patient: patients[13]._id, 
        doctor: doctors[12]._id, 
        room: rooms[31]._id, 
        admissionDate: new Date(), 
        reason: "Motor vehicle accident - trauma evaluation",
        status: "Admitted",
        attendantName: "Amy Taylor",
        condition: "Stable trauma patient",
        investigation: "CT trauma series, X-rays, Blood work",
        advancePayment: 1500,
        paymentMode: "Insurance"
      },
      { 
        patient: patients[15]._id, 
        doctor: doctors[15]._id, 
        room: rooms[11]._id, 
        admissionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
        reason: "Chemotherapy treatment cycle",
        status: "Admitted",
        attendantName: "Robert Miller",
        condition: "Stable oncology patient",
        investigation: "CBC, Comprehensive metabolic panel, Tumor markers",
        advancePayment: 8000,
        paymentMode: "Insurance"
      },
      { 
        patient: patients[24]._id, 
        doctor: doctors[26]._id, 
        room: rooms[26]._id, 
        admissionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
        reason: "Labor and delivery",
        status: "Admitted",
        attendantName: "Thomas Adams",
        condition: "Active labor, contractions regular",
        investigation: "Fetal monitoring, CBC, Type and screen",
        advancePayment: 4000,
        paymentMode: "Insurance"
      },
      { 
        patient: patients[19]._id, 
        doctor: doctors[19]._id, 
        room: rooms[13]._id, 
        admissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
        reason: "Severe abdominal pain - GI evaluation",
        status: "Admitted",
        attendantName: "Jennifer Robinson",
        condition: "Stable, abdominal pain improving",
        investigation: "CT abdomen, Upper endoscopy, Blood work",
        advancePayment: 2500,
        paymentMode: "Card"
      },
      { 
        patient: patients[21]._id, 
        doctor: doctors[20]._id, 
        room: rooms[18]._id, 
        admissionDate: new Date(), 
        reason: "Pneumonia treatment",
        status: "Admitted",
        attendantName: "Carol Young",
        condition: "Stable, responding to antibiotics",
        investigation: "Chest X-ray, Sputum culture, ABG",
        advancePayment: 1800,
        paymentMode: "Insurance"
      }
    ]);

    // Create Operations (Significantly Expanded)
    const operations = await Operation.insertMany([
      {
        patient: patients[0]._id,
        operationType: "Cardiac Bypass Surgery",
        doctor: "Dr. Amanda Chen",
        operationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        room: rooms[22]._id,
        duration: 240,
        status: "Scheduled",
        notes: "Triple vessel coronary artery bypass graft",
        preOpInstructions: "NPO after midnight. Stop anticoagulants 5 days prior. Pre-op shower with antiseptic soap.",
        postOpInstructions: "ICU monitoring 48-72 hours. Cardiac rehabilitation referral. Follow-up in 1 week."
      },
      {
        patient: patients[6]._id,
        operationType: "Total Knee Replacement",
        doctor: "Dr. Emily Rodriguez",
        operationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        room: rooms[23]._id,
        duration: 120,
        status: "Scheduled",
        notes: "Left total knee arthroplasty",
        preOpInstructions: "Physical therapy pre-op education completed. NPO 8 hours before surgery.",
        postOpInstructions: "Physical therapy day 1 post-op. DVT prophylaxis. Weight bearing as tolerated."
      },
      {
        patient: patients[13]._id,
        operationType: "Emergency Appendectomy",
        doctor: "Dr. Kevin Brown",
        operationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        room: rooms[22]._id,
        duration: 75,
        status: "Completed",
        notes: "Laparoscopic appendectomy - uncomplicated acute appendicitis",
        preOpInstructions: "Emergency procedure - minimal prep time",
        postOpInstructions: "Clear liquids 6 hours post-op, advance diet as tolerated. Discharge when stable."
      },
      {
        patient: patients[3]._id,
        operationType: "Brain Tumor Resection",
        doctor: "Dr. Jennifer Park",
        operationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        room: rooms[24]._id,
        duration: 300,
        status: "Scheduled",
        notes: "Craniotomy for left frontal lobe tumor resection",
        preOpInstructions: "Neurological baseline assessment. MRI with navigation protocol. Steroid pre-medication.",
        postOpInstructions: "Neuro ICU monitoring 48 hours. Neurological checks q2h. Post-op MRI in 24 hours."
      },
      {
        patient: patients[8]._id,
        operationType: "Spinal Fusion",
        doctor: "Dr. Lisa Thompson",
        operationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        room: rooms[25]._id,
        duration: 180,
        status: "Scheduled",
        notes: "L4-L5 posterior lumbar interbody fusion",
        preOpInstructions: "Pre-op spine X-rays and MRI. Blood type and crossmatch. Bowel prep if needed.",
        postOpInstructions: "Log roll precautions. Physical therapy evaluation. Brace fitting if required."
      },
      {
        patient: patients[15]._id,
        operationType: "Tumor Resection",
        doctor: "Dr. Daniel Johnson",
        operationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        room: rooms[23]._id,
        duration: 150,
        status: "Scheduled",
        notes: "Right hemicolectomy for colon cancer",
        preOpInstructions: "Bowel preparation. Pre-op oncology clearance. Nutritional assessment.",
        postOpInstructions: "NPO until bowel function returns. Oncology follow-up for adjuvant therapy planning."
      },
      {
        patient: patients[24]._id,
        operationType: "Cesarean Section",
        doctor: "Dr. Susan Walker",
        operationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        room: rooms[26]._id,
        duration: 60,
        status: "Scheduled",
        notes: "Scheduled C-section for breech presentation",
        preOpInstructions: "NPO 8 hours. Pre-op labs including CBC and type/screen. Anesthesia consult.",
        postOpInstructions: "Recovery room monitoring. Early ambulation. Breastfeeding support."
      },
      {
        patient: patients[27]._id,
        operationType: "Prostatectomy",
        doctor: "Dr. Robert Wilson",
        operationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        room: rooms[24]._id,
        duration: 180,
        status: "Scheduled",
        notes: "Robotic-assisted laparoscopic prostatectomy",
        preOpInstructions: "Bowel prep. Pre-op urology consultation. Blood bank sample.",
        postOpInstructions: "Foley catheter management. Pelvic floor exercises. PSA monitoring schedule."
      },
      {
        patient: patients[10]._id,
        operationType: "Tonsillectomy",
        doctor: "Dr. David Kim",
        operationDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        room: rooms[25]._id,
        duration: 45,
        status: "Scheduled",
        notes: "Bilateral tonsillectomy and adenoidectomy",
        preOpInstructions: "NPO 6 hours for pediatric patient. Parent education provided.",
        postOpInstructions: "Pain management protocol. Soft diet instructions. Follow-up in 1 week."
      },
      {
        patient: patients[22]._id,
        operationType: "Skin Cancer Excision",
        doctor: "Dr. Jessica Moore",
        operationDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        room: rooms[23]._id,
        duration: 90,
        status: "Scheduled",
        notes: "Wide local excision of melanoma with sentinel lymph node biopsy",
        preOpInstructions: "Pre-op dermatology mapping. Photography documentation.",
        postOpInstructions: "Wound care instructions. Pathology follow-up. Dermatology surveillance."
      }
    ]);

    // Create Checkups (Significantly Expanded)
    const checkups = await Checkup.insertMany([
      // Cardiology Checkups
      {
        patient: patients[0]._id,
        doctor: "Dr. Sarah Johnson",
        diagnosis: "Hypertension management - blood pressure well controlled",
        status: "Completed",
        notes: "Continue current medications. Lifestyle modifications discussed. Next visit in 3 months.",
        checkupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[1]._id,
        doctor: "Dr. Michael Rodriguez",
        diagnosis: "Post-angioplasty follow-up - stent patent",
        status: "Completed",
        notes: "Dual antiplatelet therapy continued. Exercise stress test scheduled.",
        checkupDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[2]._id,
        doctor: "Dr. Amanda Chen",
        diagnosis: "Pre-operative cardiac clearance",
        status: "In Progress",
        notes: "EKG normal, echo shows mild LV dysfunction. Cleared for surgery with monitoring.",
        checkupDate: new Date()
      },
      
      // Neurology Checkups
      {
        patient: patients[3]._id,
        doctor: "Dr. Michael Chen",
        diagnosis: "Migraine management - frequency decreased",
        status: "Completed",
        notes: "Preventive medication effective. Trigger avoidance strategies working well.",
        checkupDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[4]._id,
        doctor: "Dr. Jennifer Park",
        diagnosis: "Post-surgical follow-up - brain tumor resection",
        status: "In Progress",
        notes: "MRI shows good surgical result. Radiation oncology consultation scheduled.",
        checkupDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[5]._id,
        doctor: "Dr. Robert Kim",
        diagnosis: "Pediatric epilepsy monitoring",
        status: "Pending",
        notes: "Seizure frequency stable on current medication. EEG scheduled.",
        checkupDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      
      // Orthopedics Checkups
      {
        patient: patients[6]._id,
        doctor: "Dr. Emily Rodriguez",
        diagnosis: "Pre-operative assessment for knee replacement",
        status: "Completed",
        notes: "Cleared for surgery. Physical therapy pre-op education completed.",
        checkupDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[7]._id,
        doctor: "Dr. James Wilson",
        diagnosis: "Sports injury follow-up - ACL reconstruction",
        status: "In Progress",
        notes: "Physical therapy progressing well. Return to sports in 2 months.",
        checkupDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[8]._id,
        doctor: "Dr. Lisa Thompson",
        diagnosis: "Chronic back pain evaluation",
        status: "Completed",
        notes: "MRI shows disc herniation. Conservative management vs surgery discussed.",
        checkupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      
      // Pediatrics Checkups
      {
        patient: patients[9]._id,
        doctor: "Dr. David Kim",
        diagnosis: "8-year well-child visit",
        status: "Completed",
        notes: "Growth and development normal. Vaccinations up to date. Vision/hearing screening normal.",
        checkupDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[10]._id,
        doctor: "Dr. Maria Garcia",
        diagnosis: "Pediatric cardiology follow-up - heart murmur",
        status: "Completed",
        notes: "Innocent murmur confirmed. No restrictions on activity. Annual follow-up.",
        checkupDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[11]._id,
        doctor: "Dr. Thomas Lee",
        diagnosis: "Premature infant follow-up",
        status: "In Progress",
        notes: "Growth catching up appropriately. Developmental assessment scheduled.",
        checkupDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      
      // Emergency Follow-ups
      {
        patient: patients[12]._id,
        doctor: "Dr. Lisa Thompson",
        diagnosis: "Post-ER visit follow-up - chest pain",
        status: "Completed",
        notes: "Cardiac workup negative. Likely musculoskeletal. Primary care follow-up arranged.",
        checkupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[13]._id,
        doctor: "Dr. Kevin Brown",
        diagnosis: "Trauma follow-up - motor vehicle accident",
        status: "In Progress",
        notes: "Healing well from injuries. Physical therapy referral made.",
        checkupDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[14]._id,
        doctor: "Dr. Rachel Davis",
        diagnosis: "Emergency department follow-up - allergic reaction",
        status: "Completed",
        notes: "Reaction resolved. EpiPen prescribed. Allergy testing recommended.",
        checkupDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      },
      
      // Oncology Checkups
      {
        patient: patients[15]._id,
        doctor: "Dr. Steven Miller",
        diagnosis: "Chemotherapy cycle assessment",
        status: "In Progress",
        notes: "Tolerating treatment well. CBC stable. Next cycle scheduled.",
        checkupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[16]._id,
        doctor: "Dr. Patricia White",
        diagnosis: "Radiation therapy planning",
        status: "Pending",
        notes: "Simulation completed. Treatment to begin next week.",
        checkupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[17]._id,
        doctor: "Dr. Daniel Johnson",
        diagnosis: "Post-surgical oncology follow-up",
        status: "Completed",
        notes: "Surgical site healing well. Pathology results discussed. Adjuvant therapy planned.",
        checkupDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      
      // Gastroenterology Checkups
      {
        patient: patients[18]._id,
        doctor: "Dr. Nancy Anderson",
        diagnosis: "Inflammatory bowel disease management",
        status: "Completed",
        notes: "Symptoms well controlled on current regimen. Colonoscopy in 6 months.",
        checkupDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[19]._id,
        doctor: "Dr. Christopher Taylor",
        diagnosis: "Liver function monitoring",
        status: "In Progress",
        notes: "Liver enzymes improving. Continue current medications. Recheck in 4 weeks.",
        checkupDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      
      // Pulmonology Checkups
      {
        patient: patients[20]._id,
        doctor: "Dr. Michelle Martinez",
        diagnosis: "Asthma management - well controlled",
        status: "Completed",
        notes: "Peak flow measurements stable. Inhaler technique reviewed.",
        checkupDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[21]._id,
        doctor: "Dr. Andrew Wilson",
        diagnosis: "COPD exacerbation follow-up",
        status: "In Progress",
        notes: "Responding well to treatment. Pulmonary rehabilitation referral made.",
        checkupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      
      // Dermatology Checkups
      {
        patient: patients[22]._id,
        doctor: "Dr. Jessica Moore",
        diagnosis: "Skin cancer screening",
        status: "Completed",
        notes: "Full body examination completed. One suspicious lesion biopsied.",
        checkupDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[23]._id,
        doctor: "Dr. Brian Clark",
        diagnosis: "Acne treatment follow-up",
        status: "In Progress",
        notes: "Good response to topical treatment. Continue current regimen.",
        checkupDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
      },
      
      // Psychiatry Checkups
      {
        patient: patients[24]._id,
        doctor: "Dr. Karen Lewis",
        diagnosis: "Depression management - medication adjustment",
        status: "In Progress",
        notes: "Mood improving on new medication. Therapy sessions continuing.",
        checkupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[25]._id,
        doctor: "Dr. Mark Robinson",
        diagnosis: "ADHD follow-up - pediatric",
        status: "Completed",
        notes: "Medication dose appropriate. School performance improving.",
        checkupDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
      },
      
      // OB/GYN Checkups
      {
        patient: patients[26]._id,
        doctor: "Dr. Susan Walker",
        diagnosis: "Prenatal visit - 32 weeks gestation",
        status: "Completed",
        notes: "Pregnancy progressing normally. Fetal growth appropriate.",
        checkupDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[27]._id,
        doctor: "Dr. Jennifer Hall",
        diagnosis: "High-risk pregnancy monitoring",
        status: "In Progress",
        notes: "Gestational diabetes well controlled. Weekly monitoring continues.",
        checkupDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      
      // Urology Checkups
      {
        patient: patients[28]._id,
        doctor: "Dr. Robert Wilson",
        diagnosis: "Prostate cancer surveillance",
        status: "Completed",
        notes: "PSA stable. Continue active surveillance protocol.",
        checkupDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      },
      {
        patient: patients[29]._id,
        doctor: "Dr. Paul Young",
        diagnosis: "Kidney stone follow-up",
        status: "In Progress",
        notes: "Stone passed successfully. Dietary modifications discussed.",
        checkupDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log("Comprehensive sample data created successfully!");
    console.log(`Created ${departments.length} departments`);
    console.log(`Created ${doctors.length} doctors`);
    console.log(`Created ${rooms.length} rooms`);
    console.log(`Created ${patients.length} patients`);
    console.log(`Created ${admissions.length} admissions`);
    console.log(`Created ${operations.length} operations`);
    console.log(`Created ${checkups.length} checkups`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
import fetch from 'node-fetch';

async function testDeleteEndpoints() {
  try {
    // Test departments delete endpoint
    console.log('Testing departments DELETE endpoint...');
    const deptResponse = await fetch('http://localhost:5000/api/departments');
    const departments = await deptResponse.json();
    
    if (departments.length > 0) {
      const testDept = departments[departments.length - 1];
      console.log(`Attempting to delete department: ${testDept.name}`);
      
      const deleteResponse = await fetch(`http://localhost:5000/api/departments/${testDept._id}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        const result = await deleteResponse.json();
        console.log('✅ Department DELETE endpoint works:', result.message);
      } else {
        console.log('❌ Department DELETE failed:', deleteResponse.status);
      }
    }

    // Test admissions delete endpoint
    console.log('\nTesting admissions DELETE endpoint...');
    const admResponse = await fetch('http://localhost:5000/api/admissions');
    const admissions = await admResponse.json();
    
    if (admissions.length > 0) {
      const testAdm = admissions[admissions.length - 1];
      console.log(`Attempting to delete admission for: ${testAdm.patient?.name}`);
      
      const deleteResponse = await fetch(`http://localhost:5000/api/admissions/${testAdm._id}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        const result = await deleteResponse.json();
        console.log('✅ Admission DELETE endpoint works:', result.message);
      } else {
        console.log('❌ Admission DELETE failed:', deleteResponse.status);
      }
    }

  } catch (error) {
    console.error('Error testing delete endpoints:', error.message);
  }
}

testDeleteEndpoints();
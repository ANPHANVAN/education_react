// this js is used to handle the "Add Student" functionality in the classroom details page for a class teacher. It listens for the form submission, retrieves the class ID from the
document.getElementById('addStudentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const urlParts = window.location.pathname.split('/');
    const classId = urlParts[urlParts.indexOf('classroom-details') + 1];
    console.log('Class ID:', classId);
    const email = document.getElementById('studentEmail').value;

    try {
        const response = await fetch(`/class-teacher/api/classroom-details/${classId}/add-student`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Nếu dùng JWT thì thêm Authorization header nếu cần
            // 'Authorization': 'Bearer YOUR_TOKEN'
        },
        body: JSON.stringify({ studentEmail: email })
        });

        if (!response.ok) throw new Error('Thêm học sinh thất bại.');

        // Ẩn modal sau khi thành công
        const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
        modal.hide();

        // Option 1: Reload lại trang
        location.reload();

        // Option 2: Hoặc cập nhật giao diện không cần reload
        // updateStudentList();
    } catch (error) {
        alert(error.message);
    }
});

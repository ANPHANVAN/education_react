async function deleteStudent(studentId) {
    const urlParts = window.location.pathname.split('/');
    const classId = urlParts[urlParts.indexOf('classroom-details') + 1];

    const deleteStudent = await fetch(`/class-teacher/api/classroom-details/${classId}/delete-student`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            // Nếu dùng JWT thì thêm Authorization header nếu cần
            // 'Authorization': 'Bearer YOUR_TOKEN'
        },
        body: JSON.stringify({ studentId: studentId })
    })

    if (!deleteStudent.ok) {
        throw new Error('Xóa học sinh thất bại.');
    }

    location.reload();
}
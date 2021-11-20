 // Example starter JavaScript for disabling form submissions if there are invalid fields
 (function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    // notice: the class name need to match the class that we give to a form that we want to use with
    const forms = document.querySelectorAll('.validated-form')
    
    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()
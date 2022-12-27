/**
 * AJAX method to handle login requests...
 * 
 * @param {*} form 
 */
const loginRequest = (form, url) => {
    form.preventDefault();
    const input = form.target;

    $.ajax({
        type: 'POST',
        url: url,
        data: {
            username: input.username.value,
            password: input.password.value
        },
        success: (response) => {
            console.log(response);
        }
    })
};
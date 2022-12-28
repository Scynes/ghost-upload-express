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
            
            if (response.error) {
                console.log(response.error);
            } else {
                console.log(response)
            }
        }
    })
};

/**
 * AJAX method to handle signup requests...
 * 
 * @param {*} form 
 * @param {*} url 
 */
const signupRequest = (form, url) => {
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
            
            if (response.error) {
                console.log(response.error);
            } else {
                console.log(response)
            }
        }
    })
}
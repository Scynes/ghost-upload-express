/**
 * AJAX method to handle login requests...
 * 
 * @param {*} form 
 */
const loginRequest = (form, url) => {
    form.preventDefault();
    const input = form.target;

    console.log('wtf')
    $.ajax({
        type: 'POST',
        url: url,
        data: {
            username: input.username.value,
            password: input.password.value
        },
        success: (response) => {
            
            return response.error ? console.log(response.error) : window.location = response.redirect;
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
            
            return response.error ? console.log(response.error) : window.location = response.redirect;
        }
    })
}
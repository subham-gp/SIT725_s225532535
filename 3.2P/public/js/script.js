const addCards = (items) => {
    items.forEach(item => {
        let itemToAppend = `
            <div class="col s12 m4">
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator" src="${item.image}">
                    </div>
                    <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4">${item.title}<i class="material-icons right">more_vert</i></span>
                        <p><a href="#">${item.link}</a></p>
                    </div>
                    <div class="card-reveal">
                        <span class="card-title grey-text text-darken-4">${item.title}<i class="material-icons right">close</i></span>
                        <p class="card-text">${item.description}</p>
                    </div>
                </div>
            </div>`;
        $("#card-section").append(itemToAppend);
    });
};

//Logic to handle the form data
const formSubmitted = () => {
    let formData = {};
    formData.first_name = $('#first_name').val();
    formData.last_name = $('#last_name').val();

    console.log("Form Data Submitted: ", formData);
};

//Function to call the GET API
const getAllCars = () => {
    $.get('/api/cars', (response) => {
        if (response.statusCode === 200) {
            addCards(response.data);
        }
    });
};

$(document).ready(function () {
    //Initialize Materialize Components
    $('.modal').modal();

    //Fetch and display cars
    getAllCars();

    //Bind click event to the submit button
    $('#formSubmit').click(() => {
        formSubmitted();
    });
});
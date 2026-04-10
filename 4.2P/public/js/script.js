//Function to create HTML for a single card
const addCards = (items) => {
    items.forEach(item => {
        let itemToAppend = '<div class="col s4">' +
            '<div class="card medium"><div class="card-image waves-effect waves-block waves-light"><img class="activator" src="' + item.image + '">' +
            '</div><div class="card-content">' +
            '<span class="card-title activator grey-text text-darken-4">' + item.title + '<i class="material-icons right">more_vert</i></span><p><a href="#">' + item.link + '</a></p></div>' +
            '<div class="card-reveal">' +
            '<span class="card-title grey-text text-darken-4">' + item.title + '<i class="material-icons right">close</i></span>' +
            '<p class="card-text">' + item.description + '</p>' +
            '</div></div></div>';
        $("#card-section").append(itemToAppend);
    });
};

const formSubmitted = () => {
    let formData = {
        title: $('#first_name').val() + " " + $('#last_name').val(),
        image: "images/mustang.jpg", // Default image for inquiries
        link: "Inquiry Info",
        description: "A new inquiry submitted via the web form."
    };

    console.log("Form Data Submitted: ", formData);

    $.ajax({
        url: '/api/car',
        type: 'POST',
        data: formData,
        success: (result) => {
            if (result.statusCode === 201) {
                alert('Inquiry successfully saved to MongoDB!');
                location.reload();
            }
        },
        error: (err) => {
            alert('Error saving to database. Check console.');
            console.error(err);
        }
    });
};

// Function to pull cards from the DB on page load
const getCars = () => {
    $.get('/api/cars', (response) => {
        if (response.statusCode === 200) {
            addCards(response.data);
        }
    });
};

$(document).ready(function () {
    $('.materialboxed').materialbox();
    $('.modal').modal();
    getCars(); // Fetch data from DB when page opens
    $('#formSubmit').click(() => {
        formSubmitted();
    });
});
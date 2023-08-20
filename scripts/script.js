const apiKey = 'AIzaSyD9ji_EC2T9B1ScvSK7D4H0GGS_q5dNym4';
const sheetId = '1ILJd4_xTGQuOTatUNwx_SsnmO48MH1wTs9KOaC4fNdw';
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet2?key=${apiKey}`;

function convert_to_title_case(str) {
    return str.trim().toLowerCase().split(' ').map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
}

function get_default_card_arrangement(objects) {
    $('#students').empty();
    for (const object of objects) {
        const name = convert_to_title_case(object['Name']);
        const reg_no = object['Registration Number'];
        const specialization = object['Specialities/Expertise'];
        const projects = object['Projects'];
        const skills = object['Programming Languages'] + ", " + object['Software and Technologies'];
        const github_link = object['GitHub'];
        const linkedin_link = object['Linkedin'];
        const kaggle = object['Kaggle'];
        const portfolio_link = object['DS Portfolio Link'];
        let projects_truncated = projects;
        // if project is more is than length 50, then truncate it
        if (projects.length > 100) {
            projects_truncated = projects.substring(0, 100) + "...";
            // add a learn more link to projects
            projects_truncated += `<a href="${portfolio_link}#projects" class="">Read More</a>`;
        }
        let kaggle_button = "";
        if (kaggle) {
            kaggle_button = `<a href="${kaggle}" target="_blank" class="btn btn-icon" title="Kaggle">
            <i class="fab fa-kaggle"></i>
            </a>`;
        }
        const html = $(`
        <div class="col">
                <div class="card" id="${reg_no}">
                    <div class="row g-0">
                        <div class="col-4 d-flex align-items-center justify-content-center">
                            <div class="circle-img">
                                <img src="assets/profile_photos/${reg_no}.jpg" class="img-fluid rounded-circle" alt="Student Image">
                            </div>
                        </div>
                        <div class="col-8">
                            <div class="card-body">
                                <h2 class="card-title">${name}</h2>
                                <p class="card-text">Specialization: ${specialization}</p>
                                <p class="card-text">Skills: ${skills}</p>
                                <p class="card-text">Projects: ${projects_truncated}</p>

                                <div id="socials">
                                    <a href="${linkedin_link}" target="_blank" class="btn btn-icon" title="LinkedIn">
                                        <i class="fab fa-linkedin"></i>
                                    </a>
                                    <a href="${github_link}" target="_blank" class="btn btn-icon" title="GitHub">
                                        <i class="fab fa-github"></i>
                                    </a>
                                    ${kaggle_button}
                                    <a href="${portfolio_link}" target="_blank" class="btn btn-icon" title="Portfolio">
                                        <i class="fas fa-user"></i>
                                    </a>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $('#students').append(html);
    }
}


$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});


// ajax call to google sheets api
$.ajax({
    url: apiUrl,
    method: "GET"
}).then(function (response) {
    const [header, ...rest] = response.values;
    const result = rest.map(row => {
        const obj = {};
        header.forEach((column, index) => {
            obj[column] = row[index];
        });
        return obj;
    });
    get_default_card_arrangement(result);
}
);

//#region navbar functions
// add active to nav link clicked and remove from others
$('.nav-link').click(function () {
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
});

// add active to the current nav link based on which section is in view
$(window).on("scroll", function () {
    const fromTop = $(this).scrollTop() + 50; // Add some offset for better accuracy
    $("nav a.nav-link").each(function () {
        const section = $(this.hash);
        if (section.length) {
            if (section.offset().top <= fromTop && section.offset().top + section.height() > fromTop) {
                $("nav a.nav-link").removeClass("active");
                $(this).addClass("active");
            }
        }
    });
});
    
//#endregion
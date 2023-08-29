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
    objects.sort((a, b) => {
        const nameA = a['Name'].toLowerCase();
        const nameB = b['Name'].toLowerCase();
        if (nameA < nameB) {
            return -1;
        }
        else if (nameA > nameB) {
            return 1;
        }
        else {
            return 0;
        }
    });
    for (const object of objects) {
        $('#students').append(get_card(object));
    }
}

function get_card(object) {
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
                                <p class="card-text specialization"><b>Specialization</b>: ${specialization}</p>
                                <p class="card-text skills"><b>Skills</b>: ${skills}</p>
                                <p class="card-text projects"><b>Projects</b>: ${projects_truncated}</p>

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
    return html;
}


$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});

let results;
// ajax call to google sheets api
$.ajax({
    url: apiUrl,
    method: "GET"
}).then(function (response) {
    const [header, ...rest] = response.values;
    results = rest.map(row => {
        const obj = {};
        header.forEach((column, index) => {
            obj[column] = row[index];
        });
        return obj;
    });
    get_default_card_arrangement(results);
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

//#region search bar functions
// create a map of common abbreviations used in data science, such as nlp, iot, ml, etc. and include both the abbreviation and the full form as values
const abbreviation_map = new Map();
abbreviation_map.set('nlp', 'natural language processing');
abbreviation_map.set('iot', 'internet of things');
abbreviation_map.set('ml', 'machine learning');
abbreviation_map.set('dl', 'deep learning');
abbreviation_map.set('ai', 'artificial intelligence');
abbreviation_map.set('cv', 'computer vision');
abbreviation_map.set('rl', 'reinforcement learning');


function search(objects, search_text) {
    $('#students').empty();
    const filtered_objects = objects.filter(object => {
        const name = object['Name'].toLowerCase();
        const specialization = object['Brochure Specialization'].toLowerCase();
        const projects = object['Brochure Project'].toLowerCase();
        const skills = object['Brochure Skills'].toLowerCase();

        // if search text is an abbreviation, then search for the full form of the abbreviation and the abbreviation itself
        if (abbreviation_map.has(search_text)) {
            const full_form = abbreviation_map.get(search_text);
            return specialization.includes(search_text) || specialization.includes(full_form) || projects.includes(search_text) || projects.includes(full_form) || skills.includes(search_text) || skills.includes(full_form);
        }
        // if the search text is available as a value or a part of the value in the abbreviation map, then search for the key and the value
        if ([...abbreviation_map.values()].includes(search_text)) {
            const full_form = [...abbreviation_map.keys()][[...abbreviation_map.values()].indexOf(search_text)];
            const abbreviation = [...abbreviation_map.values()][[...abbreviation_map.keys()].indexOf(search_text)];
            return specialization.includes(search_text) || specialization.includes(full_form) || specialization.includes(abbreviation) || projects.includes(search_text) || projects.includes(full_form) || projects.includes(abbreviation) || skills.includes(search_text) || skills.includes(full_form) || skills.includes(abbreviation);
        }

        return name.includes(search_text) || specialization.includes(search_text) || projects.includes(search_text) || skills.includes(search_text);
    }
    );
    for (const object of filtered_objects) {
        $('#students').append(get_card(object));
    }
}

// get the search text and call search function when search-button is clicked
$('#search-button').click(function () {
    const search_text = $('#search-text').val();
    if (search_text === "") {
        get_default_card_arrangement(results);
        return;
    }
    const search_text_lower = search_text.toLowerCase();
    search(results, search_text_lower);
});

// detect change in search text and get default card arrangement if search text is empty
$('#search-text').on('input', function () {
    const search_text = $('#search-text').val();
    if (search_text === "") {
        get_default_card_arrangement(results);
    }
});
//#endregion
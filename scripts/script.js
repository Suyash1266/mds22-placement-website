const apiKey = 'AIzaSyD9ji_EC2T9B1ScvSK7D4H0GGS_q5dNym4';
const sheetId = '1ILJd4_xTGQuOTatUNwx_SsnmO48MH1wTs9KOaC4fNdw';
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet2?key=${apiKey}`;

function get_default_card_arrangement(objects) {
    $('#students').empty();
    for (const object of objects) {
        const name = object['Name'];
        const reg_no = object['Registration Number'];
        const specialization = object['Specialities/Expertise'];
        const projects = object['Projects'];
        const skills = object['Programming Languages'] + ", " + object['Software and Technologies'];
        const github_link = object['GitHub'];
        const linkedin_link = object['Linkedin'];
        const portfolio_link = object['DS Portfolio Link'];
        let projects_truncated = projects;
        // if project is more is than length 50, then truncate it
        if (projects.length > 100) {
            projects_truncated = projects.substring(0, 100) + "...";
            // add a learn more link to projects
            projects_truncated += `<a href="${portfolio_link}#projects" class="">Read More</a>`;
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

                                <div class="row" id="socials">
                                <div class="col">
                                    <a href="${github_link}" target="_blank" class="btn btn-icon" title="GitHub">
                                        <i class="fab fa-github"></i>
                                    </a>
                                </div>
                                <div class="col">
                                    <a href="${linkedin_link}" target="_blank" class="btn btn-icon" title="LinkedIn">
                                        <i class="fab fa-linkedin"></i>
                                    </a>
                                </div>
                                <div class="col">
                                    <a href="${portfolio_link}" target="_blank" class="btn btn-icon" title="Portfolio">
                                        <i class="fas fa-external-link-alt"></i>
                                    </a>
                                </div>
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
    console.log(response);
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
const rootURL = ''; // replace with 'https://www.hostingservice.com/yourhostedserverURL'

async function fetchResource(rootURL, association) {
    /*
        This generic fetch function retrieves any resource from the PCO database via
        an url made up of a root url and an association endpoint, using CrossPointe's
        personal access token.
    */
    const URL = rootURL + association;

    try {
        const response = await fetch(URL, {
            headers: {
                'Content-type': 'application/json'
            }
        });

        const result = response.json();

        return result;
    } catch (error) {
        console.error(error);
    };
};

async function searchForWednesday() {
    /*
        This function fetches all the groups related to CrossPointe due to the way the personal access
        token works. Then it extracts their schedules and searches the schedules with a backtracking-
        avoidant regex to see if any of the groups meet on Wednesday.
    */
    try {
        const groups = await fetchResource(rootURL, '/groups');

        const schedules = groups.map((group) => {
            return group.schedule;
        });

        for (let schedule of schedules) {
            if (schedule.match(/\b(wed(?:nesday|nesdays)?)\b/i)) {
                return true;
            };
        };

        return false;
    } catch (error) {
        console.error(error);
    };
};

function newCardContainer() {
    /*
        Create a container for a flip card and the card itself. Then put the card
        inside the parent container we just created.
    */
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    /*
        ChurchCo Code Snippet 1
    */
    const timesDiv = document.getElementById('times');
    const containerDiv = timesDiv.getElementsByClassName('container')[0];
    const serviceTimesDiv = containerDiv.getElementsByClassName('service-times')[0];
    const wednesdayNightDiv = serviceTimesDiv.getElementsByClassName('column-four')[2];
    const card = newCard(wednesdayNightDiv);
    cardContainer.appendChild(card);
    wednesdayNightDiv.innerHTML = '';
    cardContainer.style.width = '100%';
    cardContainer.style.height = '282px';
    cardContainer.style.perspective = '1000px';

    /*
        SquareSpace Code Snippet 1
    */
    // const yuiDiv = document.getElementById('block-yui_3_17_2_1_1661889157130_2821');
    // const worshipDiv = yuiDiv.querySelector('.sqs-block-content');
    // const worshipInnerDiv = worshipDiv.querySelector('.sqs-html-content');
    // const wednesdayWorshipDiv = worshipInnerDiv.querySelectorAll('h2')[3];
    // const card = newCard(wednesdayWorshipDiv);
    // cardContainer.appendChild(card);

    return cardContainer;
}

function newCard(element) {
    /*
        Create a basic card for a parent element and its children to be further
        modified later with a card back and a card front.
    */
    const card = document.createElement('div');
    card.classList.add('card');

    const cardFront = newCardFront(element);
    const cardBack = newCardBack();

    card.appendChild(cardFront);
    card.appendChild(cardBack);

    card.style.position = 'relative';
    card.style.width = '100%';
    card.style.height = '100%';
    card.style.overflow = 'visible'
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'all 0.8s ease';

    return card;
};

function newCardBack() {
    /*
        Create the back of a card element to be shown when hovered over. It will
        hide the card front.
    */
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.innerHTML = `
        <a href="https://crosspointetv.churchcenter.com/people/forms/777214" style="display: block; text-decoration: none; color: inherit; pointer-events: auto;">
            <h6>Volunteer</h6>
        </a>
    `;
    cardBack.style.position = 'absolute';
    cardBack.style.pointerEvents = 'none';
    cardBack.style.width = '100%';
    cardBack.style.height = '100%';
    cardBack.style.backfaceVisibility = 'hidden';
    cardBack.style.color = '#fff';
    cardBack.style.display = 'flex'
    cardBack.style.flexDirection = 'column';
    cardBack.style.alignItems = 'center';
    cardBack.style.justifyContent = 'center';
    cardBack.style.transform = 'rotateY(180deg)';

    return cardBack;
};

function newCardFront(element) {
    /*
        Create the front of the card that will hide the back of the card when
        the mouse is not hovering over the card.
    */
    const cardFront = document.createElement('div');
    const childElements = element.cloneNode(true);

    while (childElements.firstChild) {
        cardFront.appendChild(childElements.firstChild);
    }

    cardFront.classList.add('card-front');
    cardFront.style.position = 'absolute';
    cardFront.style.width = '100%';
    cardFront.style.height = '100%';
    cardFront.style.backfaceVisibility = 'hidden';
    cardFront.style.display = 'flex'
    cardFront.style.flexDirection = 'column';
    cardFront.style.alignItems = 'center';

    return cardFront;
};

function callVolunteers() {
    /*
        This function selects the div that contains the Wednesday night worship schedule info,
        and turns it into a flippable card with a front and back. It does this by first
        erasing the inner html of the card div and appending the front and back of the card
        to it as children, placing the card inside a container and appending the container
        to the div with the container class.
    */
    /*
        ChurchCo Code Snippet 2
    */
    const timesDiv = document.getElementById('times');
    const containerDiv = timesDiv.getElementsByClassName('container')[0];
    const serviceTimesDiv = containerDiv.querySelector('.service-times');
    const wednesdayNightDiv = serviceTimesDiv.getElementsByClassName('column-four')[2];
    const cardContainer = newCardContainer();
    const card = cardContainer.querySelector('.card');
    wednesdayNightDiv.appendChild(cardContainer);

    /*
        SquareSpace Code Snippet 2
    */
    // const yuiDiv = document.getElementById('block-yui_3_17_2_1_1661889157130_2821');
    // const worshipDiv = yuiDiv.querySelector('.sqs-block-content');
    // const worshipInnerDiv = worshipDiv.querySelector('.sqs-html-content');
    // const cardContainer = newCardContainer();
    // const card = cardContainer.querySelector('.card');
    // worshipInnerDiv.appendChild(cardContainer);

    cardContainer.addEventListener('mouseover', () => {
        card.style.transform = 'rotateY(180deg)';
    });
    cardContainer.addEventListener('mouseout', () => {
        card.style.transform = 'rotateY(0deg)';
    });
};

(async function main() {
    /*
        This is an immediately invoked function (IIF) that styles the website based on whether or not a
        group associated with CrossPointe meets on Wednesday. If a group already meets on Wednesday,
        then the function returns early to avoid making a call for more Wednesday volunteers and thus
        benefits from a performance boost.
    */
    const meetsWednesday = await searchForWednesday();

    if (meetsWednesday) return;

    callVolunteers();
})();
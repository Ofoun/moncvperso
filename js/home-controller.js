    <script>
        $(document).ready(function () {
            // Add scrollspy to <body>
            $('body').scrollspy({
                target: ".navbar a, footer a",
                offset: 50
            });

            // Add smooth scrolling on all links inside the navbar
            $("#myNavbar a").on('click', function (event) {
                // Make sure this.hash has a value before overriding default behavior
                if (this.hash !== "") {
                    // Prevent default anchor click behavior
                    event.preventDefault();

                    // Store hash
                    var hash = this.hash;

                    // Using jQuery's animate() method to add smooth page scroll
                    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                    $('html, body').animate({
                        scrollTop: $(hash).offset().top
                    }, 2000, function () {

                        // Add hash (#) to URL when done scrolling (default click behavior)
                        window.location.hash = hash;
                    });
                } // End if
            });
        }); </script>









    import Controller from "./controller.js";


    const PAGING_SIZE = 20;
    //window.location = "https://manguevie.fr/";
    //window.location.href = "https://manguevie.fr/";

    /**
     * home controller type.
     */
    class HomeController extends Controller {

        /**
         * Initializes a new preferences controller instance.
         */
        constructor() {
            super();

            Object.defineProperty(this, "articlePosition", {
                value: 0,
                writable: true
            });
        }


        /**
         * Displays the view associated with this controller.
         */
        async display() {
            super.display();
            this.displayError();

            //		if (!Controller.sessionOwner) {
            //			let loginButton = document.querySelector("header table.part1-table button.einloggen");
            //			loginButton.click();
            //			return;
            //		}

            let articleElement = document.querySelector("main article");
            while (articleElement.childElementCount > 0) articleElement.lastElementChild.remove();

            let sectionElement = document.querySelector("#rentArticle-template").content.cloneNode(true).firstElementChild;
            articleElement.append(sectionElement);

            let buttonElements = sectionElement.querySelectorAll("section.rentArticle button");

            //criteria query
            buttonElements[0].addEventListener("click", event => {
                this.articlePosition = 0;
                this.displayArticles(0);
            });

            // query all
            buttonElements[1].addEventListener("click", event => {
                this.articlePosition = 0;
                this.displayAllArticles(0);
            });

            // Backward-Paging
            // buttonElement[2].addEventListener("click", event => this.displayAllArticles(-2 * PAGING_SIZE));
            buttonElements[1].click();
        }


        async displayArticles(offset) {
            this.displayError();

            if (!offset) offset = 0;
            this.articlePosition += offset;
            if (this.articlePosition < 0) this.articlePosition = 0;

            let sectionElement = document.querySelector("#rentArticle-display-template").content.cloneNode(true).firstElementChild;
            let articleElement = document.querySelector("main article");
            while (articleElement.childElementCount > 1) articleElement.lastElementChild.remove();


            let selectElement = articleElement.querySelectorAll("select");
            let inputElements = articleElement.querySelectorAll("input");
            try {
                const resourceBuilder = new URLSearchParams();
                resourceBuilder.set("resultOffset", this.articlePosition);
                resourceBuilder.set("resultLimit", PAGING_SIZE);
                this.articlePosition += PAGING_SIZE;

                //			let resourceBuilder = new URLSearchParams();
                let value;

                value = selectElement[0].selectedOptions[0].value.trim();
                if (value.length > 0) resourceBuilder.set("city", value);

                value = inputElements[0].value.trim();
                if (value.length > 0) resourceBuilder.set("district", value);

                value = selectElement[1].selectedOptions[0].value.trim();
                if (value.length > 0) resourceBuilder.set("category", value);

                value = selectElement[2].selectedOptions[0].value.trim();
                if (value.length > 0) resourceBuilder.set("lounge", value);

                value = selectElement[3].selectedOptions[0].value.trim();
                if (value.length > 0) resourceBuilder.set("room", value);

                value = selectElement[4].selectedOptions[0].value.trim();
                if (value.length > 0) resourceBuilder.set("kitchen", value);

                value = selectElement[5].selectedOptions[0].value.trim();
                if (value.length > 0) resourceBuilder.set("shower", value);

                value = selectElement[6].selectedOptions[0].value.trim();
                if (value.length > 0) resourceBuilder.set("toilet", value);

                value = inputElements[1].value.trim();
                if (value.length > 0) resourceBuilder.set("lowerArea", value);

                value = inputElements[2].value.trim();
                if (value.length > 0) resourceBuilder.set("lowerPrice", Math.round(value));

                value = inputElements[3].value.trim();
                if (value.length > 0) resourceBuilder.set("upperPrice", Math.round(value));

                const resource = "/services/rentArticles?" + resourceBuilder.toString();
                let response = await fetch(resource, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    },
                    credentials: "include"
                });
                if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
                const rentArticles = await response.json();

                let tableBodyElement = sectionElement.querySelector("section.rentArticle-display table tbody");
                for (let rentArticle of rentArticles) {
                    let rowElement = document.createElement("tr");
                    for (let loop = 0; loop < 12; ++loop) rowElement.append(document.createElement("td"));
                    let cellElements = rowElement.querySelectorAll("td");

                    let seeButtonElement = document.createElement("anchor");
                    seeButtonElement.append("regarder");

                    cellElements[0].append(rentArticle.identity);
                    cellElements[1].append(Controller.cityMap[rentArticle.city]);
                    cellElements[2].append(rentArticle.district);
                    cellElements[3].append(Controller.categoryMap[rentArticle.category]);

                    if (rentArticle.lounge < 2) {
                        cellElements[4].append(rentArticle.lounge + " Salon");
                    } else {
                        cellElements[4].append(rentArticle.lounge + " Salons");
                    }

                    if (rentArticle.room < 2) {
                        cellElements[5].append(rentArticle.room + " Chambre");
                    } else {
                        cellElements[5].append(rentArticle.room + " Chambres");
                    }

                    if (rentArticle.kitchen < 2) {
                        cellElements[6].append(rentArticle.kitchen + " Cuisine");
                    } else {
                        cellElements[6].append(rentArticle.kitchen + " Cuisines");
                    }

                    if (rentArticle.shower < 2) {
                        cellElements[7].append(rentArticle.shower + " Douche");
                    } else {
                        cellElements[7].append(rentArticle.shower + " Douches");
                    }

                    if (rentArticle.toilet < 2) {
                        cellElements[8].append(rentArticle.toilet + " Toilette");
                    } else {
                        cellElements[8].append(rentArticle.toilet + " Toilettes");
                    }
                    cellElements[9].append(rentArticle.area + " m2");
                    cellElements[10].append(rentArticle.price + " F");
                    cellElements[11].append(seeButtonElement);
                    tableBodyElement.append(rowElement);

                    let anchorElement = rowElement.querySelector("td > anchor");
                    anchorElement.addEventListener("click", event => this.displayDescription(rentArticle));
                }
                let buttonElements = sectionElement.querySelectorAll("section.rentArticle-display div > button");

                // Backward-Paging
                buttonElements[0].addEventListener("click", event => this.displayArticles(-2 * PAGING_SIZE));

                // Forward-Paging
                buttonElements[1].addEventListener("click", event => {
                    if (rentArticles.length !== PAGING_SIZE) {
                        buttonElements[1].style.visibility = 'hidden';
                    } else {
                        this.displayArticles(0);
                        //				buttonElements[1].disabled = true;
                    }

                });


                let articleControllerButton = document.querySelector("header > div > nav > ul > li:nth-of-type(2) > a");
                buttonElements[2].addEventListener("click", event => articleControllerButton.click());

                //			articleElement.append(section);	
                articleElement.append(sectionElement);

            } catch (error) {
                this.displayError(error);
            }
        }


        /**
         * Insert or update the given rentArticle, depending on it's identity (zero for insert, non-zero for update).
         */
        async modifyArticle(rentArticle) {
            let articleElement = document.querySelector("main article");
            while (articleElement.childElementCount > 0) articleElement.lastElementChild.remove();

            let sectionElement = document.querySelector("#description-template").content.cloneNode(true).firstElementChild;
            articleElement.append(sectionElement);
            //		let sectionElement = document.querySelector("main article section.description");
            let fieldElements = sectionElement.querySelectorAll("input, select");
            rentArticle.city = fieldElements[0].selectedOptions[0].value.trim();
            rentArticle.district = fieldElements[1].value.trim();
            rentArticle.category = fieldElements[2].selectedOptions[0].value.trim();
            rentArticle.lounge = fieldElements[3].selectedOptions[0].value.trim();
            rentArticle.room = fieldElements[4].selectedOptions[0].value.trim();
            rentArticle.kitchen = fieldElements[5].selectedOptions[0].value.trim();
            rentArticle.shower = fieldElements[6].selectedOptions[0].value.trim();
            rentArticle.toilet = fieldElements[7].selectedOptions[0].value.trim();
            rentArticle.area = fieldElements[8].value.trim();
            //		rentArticle.price =		Math.round(fieldElements[9].value.trim() * 100);
            rentArticle.price = fieldElements[9].value.trim();
            rentArticle.timestamp = Date.now();

            this.displayError();
            try {
                let response = await fetch("/services/rentArticles", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/plain"
                    },
                    credentials: "include",
                    body: JSON.stringify(rentArticle)
                });
                if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
                const identity = await response.text();

                const insertMode = rentArticle.identity == 0;
                console.log("rentArticle " + (insertMode ? "created" : "updated") + ": " + identity);

                this.display();
            } catch (error) {
                this.displayError(error);
            }
        }


        async modifyArticleAvatar(rentArticle, avatarFile) {
            if (!rentArticle.identity || rentArticle.identity === "0") return;

            this.displayError();
            try {
                let response;

                // store dropped image in database, return it's ID
                response = await fetch("/services/documents", {
                    method: "POST",
                    headers: {
                        "Content-Type": avatarFile.type
                    },
                    body: avatarFile,
                    credentials: "include"
                });
                if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
                const avatarReference = parseInt(await response.text());
                if (Controller.sessionOwner.avatarReference === avatarReference) return;

                const resource = "/services/rentArticles?avatarReference=" + avatarReference;
                response = await fetch(resource, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/plain"
                    },
                    body: JSON.stringify(rentArticle),
                    credentials: "include"
                });
                if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
                rentArticle.avatarReference = avatarReference;

                let image = document.querySelector("main article > section.editArticle img");
                image.src = "/services/documents/" + rentArticle.avatarReference;
            } catch (error) {
                this.displayError(error);
            }
        }


        /**
         * Delete the given rentArticle.
         */
        async removeArticle(rentArticle) {
            this.displayError();
            try {
                const resource = "/services/rentArticles/" + rentArticle.identity;
                let response = await fetch(resource, {
                    method: "DELETE",
                    credentials: "include"
                });
                if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);

                console.log("rentArticle deleted: " + rentArticle.identity);
            } catch (error) {
                this.displayError(error);
            }

            //	this.display();
            //		this.displayArticles();
            this.displayAllArticles();
        }



        async displayDescription(rentArticle) {
            let articleElement = document.querySelector("main article");
            while (articleElement.childElementCount > 0) articleElement.lastElementChild.remove();

            let section = document.querySelector("#description-template").content.cloneNode(true).firstElementChild;
            articleElement.append(section);

            let cells = section.querySelectorAll("input, output");
            cells[0].value = rentArticle.identity;
            cells[1].value = Controller.cityMap[rentArticle.city];
            cells[2].value = rentArticle.district;
            cells[3].value = Controller.categoryMap[rentArticle.category];
            cells[4].value = rentArticle.lounge;
            cells[5].value = rentArticle.room;
            cells[6].value = rentArticle.kitchen;
            cells[7].value = rentArticle.shower;
            cells[8].value = rentArticle.toilet;
            cells[9].value = rentArticle.area;
            cells[10].value = rentArticle.price;

            if (Controller.sessionOwner) {
                cells[11].value = Controller.sessionOwner.surname + " " + Controller.sessionOwner.forename;
                cells[12].value = Controller.sessionOwner.phone;
            }

            let textarea = section.querySelector("textarea");
            textarea.value = rentArticle.message;
        }



        /**
         * TEST-ONLY operation to display all rentArticles (only 100 at a time).
         */
        async displayAllArticles(offset) {
            if (!offset) offset = 0;
            this.articlePosition += offset;
            if (this.articlePosition < 0) this.articlePosition = 0;

            let articleElement = document.querySelector("main article");
            while (articleElement.childElementCount > 1) articleElement.lastElementChild.remove();

            let section = document.querySelector("#addArticle-display-template").content.cloneNode(true).firstElementChild;
            let selectElement = articleElement.querySelectorAll("select");
            let inputAddElements = articleElement.querySelectorAll("input");
            try {
                const resourceBuilder = new URLSearchParams();
                resourceBuilder.set("resultOffset", this.articlePosition);
                resourceBuilder.set("resultLimit", PAGING_SIZE);
                this.articlePosition += PAGING_SIZE;

                const resource = "/services/rentArticles?" + resourceBuilder.toString();
                let response = await fetch(resource, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    },
                    credentials: "include"
                });

                if (!response.ok) throw new Error("HTTP " + response.status + " " + response.statusText);
                const rentArticles = await response.json();

                let tableBodyElement = section.querySelector("table tbody");
                for (let rentArticle of rentArticles) {
                    let rowElement = document.createElement("tr");
                    for (let loop = 0; loop < 12; ++loop) rowElement.append(document.createElement("td")); /* For deleting an rentArticle loop+1 */
                    let cellElements = rowElement.querySelectorAll("td");

                    let seeButtonElement = document.createElement("anchor");
                    seeButtonElement.append("regarder");

                    //				let removeButtonElement = document.createElement("anchor");            /* For deleting an rentArticle*/
                    //				removeButtonElement.append("XXX");

                    cellElements[0].append(rentArticle.identity);
                    cellElements[1].append(Controller.cityMap[rentArticle.city]);
                    cellElements[2].append(rentArticle.district);
                    cellElements[3].append(Controller.categoryMap[rentArticle.category]);

                    if (rentArticle.lounge < 2) {
                        cellElements[4].append(rentArticle.lounge + " Salon");
                    } else {
                        cellElements[4].append(rentArticle.lounge + " Salons");
                    }

                    if (rentArticle.room < 2) {
                        cellElements[5].append(rentArticle.room + " Chambre");
                    } else {
                        cellElements[5].append(rentArticle.room + " Chambres");
                    }

                    if (rentArticle.kitchen < 2) {
                        cellElements[6].append(rentArticle.kitchen + " Cuisine");
                    } else {
                        cellElements[6].append(rentArticle.kitchen + " Cuisines");
                    }

                    if (rentArticle.shower < 2) {
                        cellElements[7].append(rentArticle.shower + " Douche");
                    } else {
                        cellElements[7].append(rentArticle.shower + " Douches");
                    }

                    if (rentArticle.toilet < 2) {
                        cellElements[8].append(rentArticle.toilet + " Toilette");
                    } else {
                        cellElements[8].append(rentArticle.toilet + " Toilettes");
                    }
                    cellElements[9].append(rentArticle.area + " m2");
                    cellElements[10].append(rentArticle.price + " F");
                    cellElements[11].append(seeButtonElement);

                    //				cellElements[12].append(removeButtonElement);                   /* For deleting an rentArticle*/

                    tableBodyElement.append(rowElement);

                    //				if (Controller.sessionOwner.Group === USER) {
                    //				let removeButton = document.querySelector("cellElements[0].append(rentArticle.identity)");
                    //				removeButton.addEventListener("click", event => this.removeArticle());
                    //				let removeButtonElement = document.createElement("anchor");


                    //				let buttonElements = rowElement.querySelectorAll("td > anchor");
                    //				buttonElements[0].addEventListener("click", event => this.displayDescription(rentArticle));
                    //				buttonElements[1].addEventListener("click", event => this.removeArticle(rentArticle));
                    let buttonElement = rowElement.querySelector("td > anchor");
                    buttonElement.addEventListener("click", event => this.displayDescription(rentArticle));
                    //				buttonElements[1].addEventListener("click", event => this.removeArticle(rentArticle));          /* For deleting an rentArticle*/
                    //			}
                    //				let account;
                    //				if (account.Group === "ADMIN") return;

                    //				let anchorElement = rowElement.querySelector("td > anchor");
                    //				anchorElement.addEventListener("click", event => this.displayDescription(rentArticle));
                }

                let buttonElements = section.querySelectorAll("div > button");

                // Backward-Paging
                buttonElements[0].addEventListener("click", event => this.displayAllArticles(-2 * PAGING_SIZE));

                // Forward-Paging
                buttonElements[1].addEventListener("click", event => {
                    if (rentArticles.length == PAGING_SIZE) {
                        this.displayAllArticles(0);
                    } else {
                        //					buttonElements[1].disabled = true;
                        buttonElements[1].style.visibility = 'hidden';
                    }

                });

                let articleControllerButton = document.querySelector("header > div > nav > ul > li:nth-of-type(2) > a");
                buttonElements[2].addEventListener("click", event => articleControllerButton.click());

                articleElement.append(section);
            } catch (error) {
                this.displayError(error);
            }
        }


    }


    /**
     * Performs controller event listener registration during DOM load event handling.
     */
    window.addEventListener("load", event => {
        let controller = new HomeController();
        let anchor = document.querySelector("header > div > nav > ul > li:nth-of-type(1) > a");
        console.log(anchor.innerText);
        anchor.addEventListener("click", event => controller.display());
        anchor.click();
    });

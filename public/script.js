if (window.location.pathname === "/add-product") {
    const form = document.querySelector(".needs-validation");
    const requiredInputs = [...document.querySelectorAll("[required]")];
    const descriptions = document.querySelectorAll("#descriptions input");
    const options = document.querySelectorAll("option:not(:first-child)");
    const productType = document.querySelector("#productType");

    const addSubmitValidation = () => {
        form.addEventListener("submit", (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add("was-validated");
        }, false);
    };

    const addIndividualValidation = () => {
        requiredInputs.forEach((input) => {
            input.addEventListener("focusout", (event) => {
                event.target.parentElement.classList.add("was-validated");
            }, false);
        });
    };

    const addAttributeSwitcher = () => {
        productType.addEventListener("change", (event) => {
            descriptions.forEach((element) => {
                element.removeAttribute("required");
            });

            options.forEach((option) => {
                document.querySelector("#" + option.value.toLowerCase() + "Description").classList.add("d-none");
            });

            if (event.target.value) {
                const field = document.querySelector("#" + event.target.value.toLowerCase() + "Description");
                field.classList.remove("d-none");
                field.querySelectorAll("input").forEach((element) => {
                    element.setAttribute("required", "");
                });
            }
            addIndividualValidation();
        });

        document.querySelector("#productType").dispatchEvent(new Event("change"));
    };

    const addSkuValidator = () => {
        const sku = document.querySelector("#sku");
        const skuFeedback = document.querySelector("#skuFeedback");
        const spinner = document.querySelector("#spinner");

        const checkSkuAvailability = async (target) => {
            spinner.classList.remove("d-none");

            try {
                const response = await fetch("/api/read-product?sku=" + target.value);
                const json = await response.json();

                spinner.classList.add("d-none");

                if (json.hasOwnProperty("sku")) {
                    target.setCustomValidity("SKU already exists");
                    skuFeedback.textContent = "SKU already exists.";
                } else {
                    target.setCustomValidity("");
                    skuFeedback.textContent = "Please choose a SKU.";
                }
            } catch (error) {
                console.error(error);
                target.setCustomValidity("");
                skuFeedback.textContent = "Error occurred while checking SKU availability. Please try again later.";
            }
        };

        sku.addEventListener("focusout", async (event) => {
            await checkSkuAvailability(event.target);

            event.target.addEventListener("input", async (event) => {
                await checkSkuAvailability(event.target);
            });
        }, { once: true });
    };

    addAttributeSwitcher();
    addSubmitValidation();
    addIndividualValidation();
    addSkuValidator();
}
class CustomForm extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
        <style>
            form {
                border: 1px solid black;
            }
        </style>
        <form>
            <input type="email"
                   id="email"
                   name="email"
                   placeholder="Email"/>
            
            <input type="password"
                   id="password"
                   name="password"
                   placeholder="Password"/>
                   
           <select id="forwarders"
                   name="forwarders"
                   class="form-control">
               <option selected>Choose...</option>
            </select>
            
            <button type="button"
                    id="submitBtn">Submit!</button>
        </form>
        `;
    }

    connectedCallback() {

        // Fire the GET(s).
        const doGetReq = new CustomEvent('doGetRequest', {
            composed: true,
            detail: {
                url: 'assets/dummy-response.json'
            }
        });
        this.dispatchEvent(doGetReq);

        // Prepare the submit button to fire the 'saveForm' trigger.
        const submitBtn = this.shadowRoot.querySelector('#submitBtn');
        submitBtn.addEventListener('click', () => {
            const formData = new FormData(this.shadowRoot.querySelector('form'));
            const formAsJson = Object.fromEntries(formData.entries());

            const saveFormEvent = new CustomEvent('saveForm', {
                composed: true,
                bubbles: true,
                cancelable: false,
                detail: {
                    data: formAsJson
                }
            });
            this.dispatchEvent(saveFormEvent);
        });
    }

    set UIElements(info) {
        const asStringArray = info.params.forwarders.map(({ name }) => name);
        const select = this.shadowRoot.querySelector('#forwarders');
        for (const forwarder of asStringArray) {
            const cOption = document.createElement('option');
            cOption.value = forwarder;
            cOption.textContent = forwarder;
            select.appendChild(cOption);
        }
    }
}

// Define the new element
customElements.define('custom-form', CustomForm);
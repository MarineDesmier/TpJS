function firstTab(){
        // permet de lire le json
    fetch('http://localhost:3000/receipes')
    .then(response => response.json())
    .then(receipes => {
    let tableau = document.querySelector("#data_receipe");
        receipes.forEach(receipe => {
            tableau.innerHTML +=
            `<tr id="receipe"`+ receipe.id +`>
                <th scope="row" class="name">` + receipe.name + `</th>
                <td class="nb_part">` + receipe.nb_part + `</td>
                <td class="description">` + receipe.description + `</td>
                <td class="link">` + receipe.link + `</td>
                <td>
                    <a class="btn btn-warning" href=editReceipe.html?id=` + receipe.id + `>Modifier</a>
                    <button type="button" class="btn btn-danger" onclick="suppIngredient(` + receipe.id + `)">Supprimer</button>
                </td>
            </tr>
            `        
        });
    })
}
    
// permet de récupérer les informations d'une recette
function infoRecette(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    fetch('http://localhost:3000/receipes/' + id)
    .then(response => response.json())
    .then(receipe => {
        document.getElementById('submit').onclick = function(){
            update(receipe.id)
        };
        document.getElementById('inputName').value = receipe.name
        document.getElementById('inputNbPerson').value = receipe.nb_part
        document.getElementById('inputDescription').value = receipe.description
        document.getElementById('inputLink').value = receipe.link
        for (let i = 0; i < receipe.ingredients.length; i++) {
            addIngredient(receipe.ingredients[i].name, receipe.ingredients[i].quantity, receipe.ingredients[i].unit)
        }
        let button = document.getElementsByClassName("btnSupp");
        button[0].parentElement.innerHTML =  `<div class="col-6" id="listIngredientsBtn">
        <button class="btn btn-secondary" onclick="addIngredient()">+</button>
    </div>` ;
    })
}

// permet de modifier une recette
function updateRecette(id){
    let name = document.querySelectorAll("[name='ingredientName[]']");
    let quantite = document.querySelectorAll("[name='ingredientQuantite[]']");
    let unite = document.querySelectorAll("[name='ingredientUnite[]']");
    let ingredients = []; // initialise le tableau pour ranger mes ingrédients
    for(let i = 0; i < name.length; i++){
        let ingredient = {name: name[i].value, quantity: quantite[i].value, unit: unite[i].value};
        ingredients.push(ingredient) // on pousse les ingrédients dans le tableau 
    }
    fetch('http://localhost:3000/receipes/' +id, {
        method: 'PUT',
        body: JSON.stringify({
            name: document.getElementById('inputName').value,
            nb_part: document.getElementById('inputNbPerson').value,
            description: document.getElementById('inputDescription').value,
            link: document.getElementById('inputLink').value,
            ingredients: ingredients,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

// permet d'ajouter une recette
function addRecette(){
    let name = document.querySelectorAll("[name='ingredientName[]']");
    let quantite = document.querySelectorAll("[name='ingredientQuantite[]']");
    let unite = document.querySelectorAll("[name='ingredientUnite[]']");
    let ingredients = []; // initialise le tableau pour ranger mes ingrédients
    for(let i = 0; i < name.length; i++){
        let ingredient = {name: name[i].value, quantity: quantite[i].value, unit: unite[i].value};
        ingredients.push(ingredient) // on pousse les ingrédients dans le tableau 
    }

    fetch('http://localhost:3000/receipes', {
        method: 'POST',
        body: JSON.stringify({
            name: document.getElementById('inputName').value,
            nb_part: document.getElementById('inputNbPerson').value,
            description: document.getElementById('inputDescription').value,
            link: document.getElementById('inputLink').value,
            ingredients: ingredients,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json));
}

// permet d'ajouter les ingrédients à la liste
function addIngredient(){
    let ajoutIngr = document.getElementById('listIngredients');
    // let labelName = document.getElementById('nomIngr');
    // let labelQuantite = document.getElementById('quantiteIngr');
    // let labelUnite = document.getElementById('uniteIngr');
// je ne trouve pas comment lire mes labels pour ajouter la liste ingre
    ajoutIngr.innerHTML += `
        <div class="row">
            <div class="col-3">
                <div class="form-group">
                    <label for="inputLink">Nom</label>
                    <input required type="text" class="form-control" name="ingredientName[] value="" id="nomIngr">
                </div>
            </div>
            <div class="col-2">
                <div class="form-group">
                    <label for="inputLink">Quantité</label>
                    <input required type="number" class="form-control" name="ingredientQuantite[] value="0" id="quantiteIngr">
                </div>
            </div>
            <div class="col-1">
                <div class="form-group">
                    <label for="inputLink">Unité</label>
                    <input required type="text" class="form-control" name="ingredientUnite[] value="" id="uniteIngr">
                </div>
            </div>
            <div class="col-6" style="position: relative; top: 20px;">
                <button type="button" class="btn btn-danger btnSupp">-</button>
            </div>
        </div>`
    boutons = document.querySelectorAll(".btnSupp");
    boutons.forEach(bouton =>{
        bouton.addEventListener('click', (e) => suppIngredient(e.target));
    });
}

// permet de supprimer
function suppIngredient(id){
    fetch('http://localhost:3000/receipes/' +id, {
        method: 'DELETE',
    })
    .then(function(){
        const BOUTON_SUPPR = document.getElementById('receipe'+id);
        BOUTON_SUPPR.remove();
    });
}
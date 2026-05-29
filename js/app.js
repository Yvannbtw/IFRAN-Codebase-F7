// ============================================================
//  Ma ToDo — Séance 2 (avec routage)
// ============================================================

var $$ = Dom7;

var app = new Framework7({
    el: '#app',
    name: 'MaToDo',
    theme: 'auto',
    routes: routes,
});

var mainView = app.views.create('.view-main', { url: '/' });

// ------------------------------------------------------------
//  SÉANCE 2 — Tableau de données
// ------------------------------------------------------------
var taches = [
    { id: 1, texte: "Module F7 - Session 1", fait: true },
    { id: 2, texte: "Module F7 - Session 2", fait: true },
    { id: 3, texte: "Module F7 - Session 3", fait: false },
];

// Génère le HTML d'une tâche
function ligneTache(tache) {
    return `
        <li class="item-content" data-id="${tache.id}">
            <div class="item-media">
                <label class="checkbox">
                    <input type="checkbox" ${tache.fait ? "checked" : ""}>
                    <i class="icon-checkbox"></i>
                </label>
            </div>
            <div class="item-inner">
                <div class="item-title">${tache.texte}</div>
                <div class="item-after">
                    <a href="#" class="btn-suppr"><i class="icon f7-icons">trash</i></a>
                </div>
            </div>
        </li>
    `;
}

// Remplace tout le contenu de la liste
function afficher() {
    $$('.liste-taches').html(taches.map(ligneTache).join(''));
}

// Ajoute une nouvelle tâche
function ajouterTache(texte) {
    if (texte.trim() === '') return;
    var nouvelId = taches.reduce(function (m, t) { return Math.max(m, t.id); }, 0) + 1;
    taches.push({ id: nouvelId, texte: texte.trim(), fait: false });
    afficher();
}

// Supprime une tâche par son id
function supprimerTache(id) {
    taches = taches.filter(function (t) { return t.id !== parseInt(id, 10); });
    afficher();
}

// --- Écouteurs d'événements ---

// Appel de afficher() quand la page taches est chargée par le routeur
$$(document).on('page:init', '.page[data-name="taches"]', function () {
    afficher();
});

// Bouton "Ajouter" (délégation sur document)
$$(document).on('click', '#btn-ajouter', function () {
    var champ = $$('#champ-tache');
    ajouterTache(champ.val());
    champ.val('');
});

// Appuyer sur Entrée dans le champ
$$(document).on('keypress', '#champ-tache', function (e) {
    if (e.key === 'Enter') {
        ajouterTache($$(this).val());
        $$(this).val('');
    }
});

// Bouton corbeille (délégation sur document)
$$(document).on('click', '.btn-suppr', function (e) {
    e.preventDefault();
    var id = $$(this).parents('.item-content').attr('data-id');
    supprimerTache(id);
});

// ------------------------------------------------------------
//  SÉANCE 3 — à compléter :
//    - basculerTache(id)  → cocher / décocher
//    - compteur de tâches restantes
//    - filtres : Toutes / À faire / Faites
//    - chargerTaches() et sauvegarder() avec localStorage
// ------------------------------------------------------------

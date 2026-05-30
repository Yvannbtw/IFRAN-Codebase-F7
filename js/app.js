// ============================================================
//  Ma ToDo — app.js complet (séance 3 + dark mode)
// ============================================================

// --- Dark mode : appliquer avant l'init F7 pour éviter le flash ---
(function () {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    }
})();

var $$ = Dom7;

var app = new Framework7({
    el: '#app',
    name: 'MaToDo',
    theme: 'auto',
    routes: routes,
});

var mainView = app.views.create('.view-main', { url: '/' });

// ============================================================
//  DARK MODE
// ============================================================

function updateThemeIcon() {
    var isDark = document.documentElement.classList.contains('dark');
    $$('.theme-icon').text(isDark ? 'sun_max' : 'moon_stars');
}

function toggleDarkMode() {
    var isDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    updateThemeIcon();
}

$$(document).on('click', '.btn-theme-toggle', function (e) {
    e.preventDefault();
    toggleDarkMode();
});

// ============================================================
//  DONNÉES — localStorage
// ============================================================

var CLE = 'ma-todo-taches';

function sauvegarder() {
    localStorage.setItem(CLE, JSON.stringify(taches));
}

function chargerTaches() {
    var data = localStorage.getItem(CLE);
    if (data) return JSON.parse(data);
    return [
        { id: 1, texte: 'Module F7 - Session 1', fait: true  },
        { id: 2, texte: 'Module F7 - Session 2', fait: true  },
        { id: 3, texte: 'Module F7 - Session 3', fait: false },
    ];
}

var taches = chargerTaches();

// ============================================================
//  FILTRES
// ============================================================

var filtreActif = 'toutes';

function tachesVisibles() {
    if (filtreActif === 'afaire') return taches.filter(function (t) { return !t.fait; });
    if (filtreActif === 'faites') return taches.filter(function (t) { return t.fait;  });
    return taches;
}

// ============================================================
//  AFFICHAGE
// ============================================================

function ligneTache(tache) {
    return `
        <li class="item-content" data-id="${tache.id}">
            <div class="item-media">
                <label class="checkbox">
                    <input type="checkbox" ${tache.fait ? 'checked' : ''}>
                    <i class="icon-checkbox"></i>
                </label>
            </div>
            <div class="item-inner">
                <div class="item-title ${tache.fait ? 'tache-faite' : ''}">${tache.texte}</div>
                <div class="item-after">
                    <a href="#" class="btn-suppr link">
                        <i class="icon f7-icons" style="font-size:18px;color:var(--f7-theme-color)">trash</i>
                    </a>
                </div>
            </div>
        </li>
    `;
}

function afficher() {
    $$('.liste-taches').html(tachesVisibles().map(ligneTache).join(''));
    var restantes = taches.filter(function (t) { return !t.fait; }).length;
    $$('.compteur').text(restantes + ' tâche(s) restante(s)');
}

// ============================================================
//  ACTIONS
// ============================================================

function ajouterTache(texte) {
    if (texte.trim() === '') return;
    var nouvelId = taches.reduce(function (m, t) { return Math.max(m, t.id); }, 0) + 1;
    taches.push({ id: nouvelId, texte: texte.trim(), fait: false });
    sauvegarder();
    afficher();
    app.toast.create({ text: '✅ Tâche ajoutée !', closeTimeout: 1200 }).open();
}

function supprimerTache(id) {
    taches = taches.filter(function (t) { return t.id !== parseInt(id, 10); });
    sauvegarder();
    afficher();
}

function basculerTache(id) {
    var t = taches.find(function (x) { return x.id === parseInt(id, 10); });
    if (t) {
        t.fait = !t.fait;
        sauvegarder();
        afficher();
    }
}

// ============================================================
//  STATS ACCUEIL
// ============================================================

function updateAccueilStats() {
    var total     = taches.length;
    var faites    = taches.filter(function (t) { return t.fait; }).length;
    var restantes = total - faites;
    $$('#stat-total').text(total);
    $$('#stat-faites').text(faites);
    $$('#stat-restantes').text(restantes);
}

// ============================================================
//  ÉVÉNEMENTS — Pages
// ============================================================

// Accueil : init + reinit (retour en arrière)
$$(document).on('page:init page:reinit', '.page[data-name="accueil"]', function () {
    updateAccueilStats();
    updateThemeIcon();
});

// Tâches : init
$$(document).on('page:init', '.page[data-name="taches"]', function () {
    afficher();
    updateThemeIcon();
});

// ============================================================
//  ÉVÉNEMENTS — Interactions
// ============================================================

// Bouton Ajouter
$$(document).on('click', '#btn-ajouter', function () {
    var champ = $$('#champ-tache');
    ajouterTache(champ.val());
    champ.val('');
});

// Touche Entrée
$$(document).on('keypress', '#champ-tache', function (e) {
    if (e.key === 'Enter') {
        ajouterTache($$(this).val());
        $$(this).val('');
    }
});

// Corbeille
$$(document).on('click', '.btn-suppr', function (e) {
    e.preventDefault();
    var id = $$(this).parents('.item-content').attr('data-id');
    supprimerTache(id);
});

// Case à cocher
$$(document).on('change', '.liste-taches input[type="checkbox"]', function () {
    var id = $$(this).parents('.item-content').attr('data-id');
    basculerTache(id);
});

// Filtres
$$(document).on('click', '.filtre-btn', function () {
    $$('.filtre-btn').removeClass('button-active');
    $$(this).addClass('button-active');
    filtreActif = $$(this).attr('data-filtre');
    afficher();
});

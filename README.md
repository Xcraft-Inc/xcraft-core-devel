# 📘 Documentation du module xcraft-core-devel

## Aperçu

Le module `xcraft-core-devel` fournit des outils d'aide au développement pour l'écosystème Xcraft. Il propose principalement des fonctionnalités pour appliquer des patches à des fichiers source, facilitant ainsi la maintenance et l'adaptation du code selon les plateformes et distributions.

## Structure du module

Le module est composé de deux fonctions principales :

- **`patch`** : Applique un fichier de patch spécifique à un répertoire source
- **`autoPatch`** : Applique automatiquement une série de patches en fonction de critères comme la plateforme ou la distribution

## Fonctionnement global

Ce module facilite le développement en permettant :

1. L'application de patches individuels sur des fichiers source
2. L'application automatique de patches en fonction de la plateforme ou de la distribution
3. Le traitement ordonné des patches grâce à un système de nommage spécifique

Le module utilise la commande système `patch` et gère les flux de sortie pour fournir des informations détaillées sur le processus d'application des patches.

## Exemples d'utilisation

### Application d'un patch

```javascript
const devel = require('xcraft-core-devel');

// Appliquer un patch spécifique
devel.patch(
  '/chemin/vers/sources',
  '/chemin/vers/mon-patch.patch',
  1,
  this.quest.resp,
  (err) => {
    if (err) {
      console.error("Échec de l'application du patch:", err);
    } else {
      console.log('Patch appliqué avec succès');
    }
  }
);
```

### Application automatique de patches

```javascript
const devel = require('xcraft-core-devel');

// Appliquer automatiquement tous les patches pertinents
devel.autoPatch(
  '/chemin/vers/patches',
  '/chemin/vers/sources',
  'debian',
  this.quest.resp,
  (err) => {
    if (err) {
      console.error("Échec de l'application des patches:", err);
    } else {
      console.log('Tous les patches ont été appliqués avec succès');
    }
  }
);
```

## Interactions avec d'autres modules

Ce module interagit avec :

- [xcraft-core-fs] : Pour la manipulation de fichiers et répertoires
- [xcraft-core-platform] : Pour la détection de la plateforme d'exécution

## Détails des sources

### `index.js`

Ce fichier expose les fonctions principales pour l'application de patches.

#### Méthodes publiques

- **`patch(srcDir, patchFile, stripNum, resp, callback)`** - Applique un fichier de patch spécifique à un répertoire source. La fonction utilise la commande système `patch` et redirige les sorties standard et d'erreur vers les fonctions de log fournies dans l'objet `resp`.

  - `srcDir` : Répertoire source où appliquer le patch
  - `patchFile` : Chemin vers le fichier de patch à appliquer
  - `stripNum` : Nombre de segments de chemin à ignorer (option `-p` de la commande patch)
  - `resp` : Contexte de de réponse de quête Xcraft
  - `callback` : Fonction appelée à la fin avec une erreur ou null

- **`autoPatch(patchesDir, srcDir, distribution, resp, callback)`** - Applique automatiquement tous les patches pertinents d'un répertoire à un répertoire source. Les patches sont appliqués dans l'ordre alphabétique et peuvent être spécifiques à une plateforme ou une distribution.
  - `patchesDir` : Répertoire contenant les fichiers de patch
  - `srcDir` : Répertoire source où appliquer les patches
  - `distribution` : Distribution cible (ex: 'debian')
  - `resp` : Contexte de de réponse de quête Xcraft
  - `callback` : Fonction appelée à la fin avec une erreur ou null

## Conventions de nommage des patches

Les patches doivent suivre une convention de nommage spécifique pour être reconnus par la fonction `autoPatch` :

- Préfixe numérique (ex: `001-fix-bug.patch`) : Patch générique applicable à toutes les plateformes
- Préfixe de plateforme (ex: `linux-fix-bug.patch`) : Patch spécifique à une plateforme
- Préfixe de distribution (ex: `debian-fix-bug.patch`) : Patch spécifique à une distribution

Les patches sont appliqués dans l'ordre alphabétique, ce qui permet de contrôler leur séquence d'application.

## Fonctionnement technique

### Processus d'application d'un patch

1. La fonction `patch` change d'abord le répertoire courant vers le répertoire source
2. Elle lance ensuite la commande système `patch` avec l'option `-p` appropriée
3. Le contenu du fichier de patch est envoyé à l'entrée standard de la commande
4. Les sorties standard et d'erreur sont capturées et redirigées vers les fonctions de log
5. Une fois le processus terminé, la fonction restaure le répertoire courant et appelle le callback

### Sélection des patches dans autoPatch

La fonction `autoPatch` utilise une expression régulière pour sélectionner les patches pertinents :

- Patches avec un préfixe numérique
- Patches spécifiques à la plateforme actuelle (détectée via `xcraft-core-platform`)
- Patches spécifiques à la distribution fournie en paramètre

Les patches sélectionnés sont ensuite triés alphabétiquement et appliqués séquentiellement.

_Cette documentation a été mise à jour automatiquement._

[xcraft-core-fs]: https://github.com/Xcraft-Inc/xcraft-core-fs
[xcraft-core-platform]: https://github.com/Xcraft-Inc/xcraft-core-platform
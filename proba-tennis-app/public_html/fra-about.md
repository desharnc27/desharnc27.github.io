# À propos de cette application

Cette application calcule la probabilité de remporter un match de tennis, à partir de n'importe quel format de match et de n'importe quel score actuel.

---

## Quelle suppositions fait l'algorithme pour effectuer ses calculs ?

L'exactitude de l'algorithme repose sur les hypothèses suivantes :

- Le joueur 1 a une probabilité x de remporter un point lorsqu’il sert et une probabilité y de remporter un point en retour de service. Ces deux valeurs sont appelées les probabilités de base.
- Ces deux probabilités restent constantes pendant toute la durée du match.
- Chaque point est indépendant du précédent (le résultat d’un point n'affecte pas les probabilités des points suivants).

Ne pas confondre probabilités de base avec probabilités résultantes.  
Les probabilités résultantes sont les valeurs calculées par l'algorithme : probabilité de remporter un jeu, un set ou le match.

---

## Quels sont les paramètres qui déterminent la probabilité de remporter un match ?

Selon le modèle, la probabilité que le joueur 1 remporte le match dépend de trois paramètres, définis par l'utilisateur :

1. Les probabilités de base définies plus haut, qui indiquent les chances de remporter un point, respectivement au service et en retour.
2. Le format du match (nombre de sets, nombre de jeux par set, présence ou absence de tie-break dans le dernier set, etc.).
3. Le score actuel

---

## Qu'est-ce que l'algorithme fournit comme réponse ?

À partir des paramètres définis ci-dessus, l'algorithme calcule la probabilité :

- que le joueur 1 remporte le jeu en cours.
- que le joueur 1 remporte le set en cours.
- que le joueur 1 remporte le match.

Ces trois probabilités sont appelées les probabilités résultantes.

L'algorithme fournit également l'importance du prochain point, qui est la différence entre ces deux valeurs :

- Si le joueur 1 gagne le prochain point, quelle sera ensuite la probabilité qu'il remporte le match.
- Si le joueur 1 perd le prochain point, quelle sera ensuite la probabilité qu'il remporte le match.

---

## Comment l'algorithme effectue-t-il ces calculs ?

Dès que le format du match et les probabilités de base sont définis, l'algorithme pré-calcule toutes les probabilités résultantes pour tous les scores possibles grâce à la programmation dynamique.

Avantage :  
Lorsque l'utilisateur modifie le score actuel, l'algorithme met à jour les probabilités résultantes avec très peu de calculs.

Désavantage :  
Si l'utilisateur modifie les probabilités de base ou le format du match, tous les calculs doivent être refaits entièrement. C'est pourquoi ces paramètres ne sont pas modifiables directement dans l'interface principale, mais plutôt par le menu.

Note: si vous êtes tombé sur une page web aux fonctionnalités similaires qui dit utiliser les chaines de Markov, sachez que pour ce problème précis, c'est parfaitement équivalent à la programmation dynamique. L'algorithme ici est donc essentiellement le même, et produira exactement les mêmes résultats pour les formats de match permis par l'autre site. La seule différence est que l'algorithme ici est beaucoup plus flexible pour les formats de match.


---

## Ces calculs sont-ils réalistes pour un vrai match ATP/WTA ?

Ils ne sont pas parfaits, mais offrent une bonne approximation.  
Le réalisme du modèle dépend des hypothèses formulées au début.

### Ce qui est approximatif :
- Les probabilités de base sont-elles constantes ?  
  En réalité, elles peuvent varier (fatigue, stress, adaptation de l'adversaire…).
- Les points sont-ils parfaitement indépendants ?  
  Quand une variation par des causes ci-dessus survient, elle affecte normalement plusieurs points consécutifs, ce qui crée une dépendance entre les points consécutifs.

Par exemple, si en plein milieu du match, un joueur est à 15-40 et fait face à deux balles de bris, ça veut probablement dire que quelque chose s'est mis à clocher très récemment (nervosité, malaise physique, montée soudaine du sang-froid de l'adversaire...). Dans ce cas, supposer que les probabilités de bases qui ont généré tout ce qui a précédé dans le match sont les mêmes que les probabilités de base pour le jeu actuel n'est pas toujours exact. Les réelles chances de bris sont donc peut-être légèrement plus élevées que ce qui est calculé par l'algorithme. Ceci dit, d'autres facteurs peuvent parfois compenser dans l'autre sens. Par exemple, certains joueurs au mental d'acier (ex: Djokovic), à 15-40, vont au contraire réussir à se concentrer davantage avant leur prochain service, ce qui va diminuer les chances de bris.

En résumé :  
L'algorithme n'est pas une représentation parfaite de la réalité, mais il constitue une excellente approximation des probabilités réelles.

---

## À quoi sert le mode "Game Flow" ?

Si vous suivez un match en direct, vous pouvez avoir cette application ouverte en parallèle et actualiser les points au fil du match. En effet, en mode "Editable", il faut éditer les trois colonnes (sets, jeux, points) indépendamment, mais en mode "Game Flow", l'interface détecte les complétions de jeux/sets et transfert automatiquement toute modification nécessaire à la colonne de gauche. Cela rend "Game Flow" idéal pour suivre un match en direct.

Pendant tout ce temps, vous verrez l'évolution des chances de victoire tout au long du match. Un autre aspect intéressant est que vous pourrez voir quantitativement l'importance de chaque point avant qu'il soit joué... et voir quel joueur est le meilleur quand ça compte le plus!

---

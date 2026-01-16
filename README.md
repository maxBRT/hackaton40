# Hackaton 40

Ce projet est composé d'un backend et d'un frontend.

## Installation

## Base de données (Prisma)

Le projet utilise Prisma comme ORM. Voici les commandes utiles pour initialiser et gérer la base de données :

**Configuration des variables d'environnement** :
   Créez un fichier `.env` dans le dossier `backend` en vous basant sur `.env.example`.

**Génération du client Prisma** :
   ```bash
   cd backend && npx prisma generate
   ```

**Application des migrations** (pour synchroniser le schéma avec la base de données) :
   ```bash
   cd backend && npx prisma migrate dev
   ```

**Initialisation des données (Seed)** :
   ```bash
   cd backend && npm run seed
   ```
**Pour installer les dépendances du backend et du frontend** :
```bash
make install
```

## Développement

**Pour lancer le backend et le frontend simultanément** :
```bash
make dev
```

### Commandes individuelles

- Lancer le backend : `make start-backend`
- Lancer le frontend : `make start-frontend`



## Technologies et Librairies

### Backend
- **Express** : Framework web minimaliste pour Node.js.
- **Prisma** : ORM pour interagir avec la base de données (PostgreSQL via Neon).
- **Zod** : Validation de schémas de données avec intégration OpenAPI pour la documentation.
- **JWT & Bcrypt** : Gestion de l'authentification sécurisée.
- **Swagger UI** : Interface pour visualiser et tester l'API (disponible sur `http://localhost:3000/api/docs` quand le backend est lancé).

### Frontend
- **React 19** : Bibliothèque pour l'interface utilisateur.
- **Vite** : Outil de build rapide pour le développement moderne.
- **Tailwind CSS** : Framework CSS utilitaire pour le design.
- **React Router** : Gestion de la navigation.
- **Axios** : Client HTTP pour les appels API.
- **shadcn/ui & Lucide React** : Composants UI accessibles et icônes.
- **Dicebear** : Génération d'avatars personnalisés.

## L'intelligence artificielle a été utilisée dans ce projet pour :
- Déboguer le code.
- Générer les message de commit github
- Conseils sur les meilleures pratiques.
- Proposer des suggestions de refactorisation.
- Assister à la résolution de problèmes techniques.
- Générer les données de test (seed) pour la base de données.
- Corriger les fautes d'orthographe dans la documentation.

### Mention importante (Maxime)
La configuration de Zod et d’OpenAPI a été implémentée manuellement (le code n’a pas été généré par l’IA). Cependant, lors de la connexion du frontend au backend, certaines routes ont été modifiées afin d’offrir une réponse plus adaptée aux besoins de l’application. À ce moment-là, j’ai utilisé l’IA pour refléter ces changements dans le schéma OpenAPI.
J'estime que cette utilisation pourrait être considérée comme de la génération de code et c'est pourquoi je le mentionne ouvertement. Mon but n'était pas de déléguer mon travail à l'IA, mais bien de l'utiliser comme un outil pour compléter mon workflow.



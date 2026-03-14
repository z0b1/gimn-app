# GimnApp - Učenički parlament Šabačke gimnazije

Zvanična veb platforma Učeničkog parlamenta Šabačke gimnazije namenjena informisanju učenika, digitalnom glasanju i komunikaciji unutar školske zajednice.

## Glavne Funkcionalnosti

- **Gimnazija Feed**: Interaktivna mreža za deljenje vesti, objava i multimedijalnog sadržaja.
- **Digitalno Glasanje**: Transparentan sistem za glasanje o učeničkim predlozima i novim pravilima.
- **Pitanja i Sugestije (Q&A)**: Direktan kanal komunikacije sa parlamentom uz sistem statusa (U obradi, Odgovoreno, Rešeno).
- **Sistem Obaveštenja**: Real-time obaveštenja (in-app i email) za interakcije na obajvama i odgovorima.
- **Admin Panel**: Napredni alati za moderaciju sadržaja, upravljanje korisnicima i kreiranje vesti.

## Tehnologije

- **Framework**: Next.js 14 (App Router)
- **Stilizacija**: Tailwind CSS
- **Autentifikacija**: Clerk
- **Baza podataka**: PostgreSQL (Neon.tech)
- **ORM**: Prisma
- **Email**: Nodemailer (Gmail SMTP)

## Razvoj

Za pokretanje u lokalnom okruženju:

```bash
npm install
npm run dev
```

Potrebne su environment varijable za Clerk, Neon DB i Gmail SMTP (pogledati `.env.example`).

---
© 2026 Učenički parlament Šabačke gimnazije.

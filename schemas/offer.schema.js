import { z } from "zod";

export const OfferSchema = z.object({
    code: z.string().min(1, "Le code est requis."),
    title: z.string().min(1, "Le titre est requis."),
    description: z.string().min(1, "La description est requise."),
    createdAt: z.date("La date de création est requise."),
    contractType: z.enum(["CDI", "CDD"]),
    company: z.object({
        name: z.string().min(1, "Le nom de l'entreprise est requis."),
    }),
});

export const RawOfferSchema = z.object({
    id: z.string().min(1, "ID is required"),
    intitule: z.string().min(1, "Le titre est requis."),
    description: z.string().min(1, "La description est requise."),
    dateCreation: z.date("La date de création est requise."),
    typeContrat: z.enum(["CDI", "CDD"]),
    entreprise: z.object({
        nom: z.string().min(1, "Le nom de l'entreprise est requis."),
    }),
});


-- Corrigir colunas da tabela Course
ALTER TABLE public."Course" RENAME COLUMN "cover_image" TO "coverImage";
ALTER TABLE public."Course" RENAME COLUMN "registration_start" TO "registrationStart";
ALTER TABLE public."Course" RENAME COLUMN "registration_end" TO "registrationEnd";
ALTER TABLE public."Course" RENAME COLUMN "whatsapp_msg" TO "whatsappMsg";
ALTER TABLE public."Course" RENAME COLUMN "show_in_home" TO "showInHome";
ALTER TABLE public."Course" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE public."Course" RENAME COLUMN "updated_at" TO "updatedAt";

-- Corrigir colunas da tabela PegueMonte
ALTER TABLE public."PegueMonte" RENAME COLUMN "video_url" TO "videoUrl";
ALTER TABLE public."PegueMonte" RENAME COLUMN "cover_image" TO "coverImage";
ALTER TABLE public."PegueMonte" RENAME COLUMN "whatsapp_msg" TO "whatsappMsg";
ALTER TABLE public."PegueMonte" RENAME COLUMN "store_phones" TO "storePhones";
ALTER TABLE public."PegueMonte" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE public."PegueMonte" RENAME COLUMN "updated_at" TO "updatedAt";

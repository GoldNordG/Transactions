--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaction" (
    id integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "clientName" text NOT NULL,
    "clientMail" text,
    "orderNumber" text NOT NULL,
    amount double precision NOT NULL,
    location text,
    "userId" integer,
    designation text,
    phone text,
    weight double precision NOT NULL,
    "factureNumber" text DEFAULT 'N/A'::text NOT NULL,
    paiement text DEFAULT 'non spécifié'::text NOT NULL,
    adresse text NOT NULL,
    "codePostal" text NOT NULL,
    ville text NOT NULL,
    "jewelryPhotoUrl" text,
    "paymentProofUrl" text,
    "fraudChecked" boolean DEFAULT false NOT NULL,
    "isFraud" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Transaction" OWNER TO postgres;

--
-- Name: TransactionItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TransactionItem" (
    id integer NOT NULL,
    designation text NOT NULL,
    carats text NOT NULL,
    weight double precision NOT NULL,
    "unitPrice" double precision NOT NULL,
    subtotal double precision NOT NULL,
    "transactionId" integer NOT NULL
);


ALTER TABLE public."TransactionItem" OWNER TO postgres;

--
-- Name: TransactionItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."TransactionItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TransactionItem_id_seq" OWNER TO postgres;

--
-- Name: TransactionItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."TransactionItem_id_seq" OWNED BY public."TransactionItem".id;


--
-- Name: Transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Transaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Transaction_id_seq" OWNER TO postgres;

--
-- Name: Transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Transaction_id_seq" OWNED BY public."Transaction".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text NOT NULL,
    location text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Transaction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction" ALTER COLUMN id SET DEFAULT nextval('public."Transaction_id_seq"'::regclass);


--
-- Name: TransactionItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransactionItem" ALTER COLUMN id SET DEFAULT nextval('public."TransactionItem_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transaction" (id, date, "clientName", "clientMail", "orderNumber", amount, location, "userId", designation, phone, weight, "factureNumber", paiement, adresse, "codePostal", ville, "jewelryPhotoUrl", "paymentProofUrl", "fraudChecked", "isFraud") FROM stdin;
3	2025-04-08 00:00:00	Guillaume	goldnord.digital@gmail.com	12742	165	Maubeuge	\N	bague	0711111111	3	26	cheque	85bis avenue de France 	59600	Maubeuge	\N	\N	f	f
24	2025-04-14 00:00:00	Guillaume	goldnord.digital@gmail.com	158	141.9	Maubeuge	\N	1 bague	0711111111	2.58	28	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1M4ghQrruPlyakh5QzOgKiwd_kBI3CZDE/view?usp=drivesdk	https://drive.google.com/file/d/10mkXm4rz_uWWreJmV9GFB7fe0YmAHKYp/view?usp=drivesdk	f	f
4	2025-04-09 00:00:00	Guillaume	goldnord.digital@gmail.com	03	55	Maubeuge	\N	bague	0711111111	1	03	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/17Yu4JGBLlGStvvSAjhKqVM_qC2jkgZq3/view?usp=drivesdk	https://drive.google.com/file/d/1hq2mgMiomCkqDaAPRw4OLuun7rCobpMO/view?usp=drivesdk	f	f
5	2025-04-09 00:00:00	Guillaume	goldnord.digital@gmail.com	04	550	Maubeuge	\N	bague	0711111111	10	04	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1rrRebBDSuQNyuZ9wRSAery4baHSv8MK5/view?usp=drivesdk	https://drive.google.com/file/d/1W174CdcwS1XLkqJiLG8aDK37eJnbMje8/view?usp=drivesdk	f	f
6	2025-04-09 00:00:00	Guillaume	goldnord.digital@gmail.com	04	550	Maubeuge	\N	bague	0711111111	10	04	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1wyhTFS8N7gKyHfdi4gC7lHJzq2x3och9/view?usp=drivesdk	https://drive.google.com/file/d/1vG6C5n2R6FLJ1wmOpaagliMHEZlxXK0i/view?usp=drivesdk	f	f
10	2025-04-10 00:00:00	Guillaume	goldnord.digital@gmail.com	05	550	Maubeuge	\N	bague	0711111111	10	03	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1P1BeRyqovMGd-Ba4aziCU9PHzctQlime/view?usp=drivesdk	https://drive.google.com/file/d/1nHQm4Ne44HfNtawhpSBbpVqTYXUiekYo/view?usp=drivesdk	f	f
11	2025-04-10 00:00:00	Guillaume	goldnord.digital@gmail.com	07	550	Maubeuge	\N	bague	0711111111	10	07	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1nzh01pklltso5PJERkCFX1CSKeIQrU0C/view?usp=drivesdk	https://drive.google.com/file/d/1Jpdx06WGlgb5MoG4PLVKhOqzGTwPfMia/view?usp=drivesdk	f	f
16	2025-04-12 00:00:00	Guillaume	goldnord.digital@gmail.com	12755	1870	Maubeuge	\N	bague, bracelet, boucle d'oreille, bague	0711111111	65	14	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1VbPTZ-5s9vuJaagaGNLPdwaAKWt2-6uY/view?usp=drivesdk	https://drive.google.com/file/d/1hqWdsNqNpPnAtPmQk2NVZgxBxyrguxby/view?usp=drivesdk	f	f
17	2025-04-12 00:00:00	Guillaume	goldnord.digital@gmail.com	159	2480.03	Beauvais	\N	1x10f marianne, bracelet, boucle d'oreille, bague	0711111111	48.75	12	cheque	85bis avenue de France 	59600	Beauvais	https://drive.google.com/file/d/14Ov33iDHCYrUY1745_4cz3ABcRNx2BpT/view?usp=drivesdk	https://drive.google.com/file/d/1Rj7fvAPCd0CzYAZynlPN0cQXMYVphvY6/view?usp=drivesdk	f	f
18	2025-04-12 00:00:00	Test	goldnord.digital@gmail.com	160	4648.28	Beauvais	\N	10x10f marianne, 1 bague	0711111111	67.72	42	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1fteIwhM8FWTC1dN5eX3Pr9PyhAGb0-59/view?usp=drivesdk	https://drive.google.com/file/d/1icVGujB8ZAOPhRBV-GLMxk1ebKHActTN/view?usp=drivesdk	f	f
19	2025-04-12 00:00:00	Guillaume	goldnord.digital@gmail.com	161	695.05	Beauvais	\N	1 bague, 1x1f marianne	0711111111	16.45	23	virement	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1VHj9dfFSeDJt4G-2z24UPEIIy0QBHpmi/view?usp=drivesdk	https://drive.google.com/file/d/1VYThzzIkXAO0ACnph2Zkd2TBVtNPPib5/view?usp=drivesdk	f	f
20	2025-04-12 00:00:00	Guillaume	goldnord.digital@gmail.com	162	614.05	Beauvais	\N	1 bague, 1x1f marianne	0711111111	9.7	23	virement	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1PssnNuKRi5EHDTljMmf-gTk7D_mpjH58/view?usp=drivesdk	https://drive.google.com/file/d/1TjEFlbGeaCt4ifX43TqLgvd2S1PTM5zS/view?usp=drivesdk	f	f
21	2025-04-12 00:00:00	Guillaume	goldnord.digital@gmail.com	167	614.6	Beauvais	\N	1 bague, 1x1f marianne	0711111111	9.65	26	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1gmlykHSZUnKYvIymBTbfEGO9tmv_TUx0/view?usp=drivesdk	https://drive.google.com/file/d/1VNY_DTVXgJ_AAqp8guJvXAKrNdl5PXtA/view?usp=drivesdk	f	f
22	2025-04-12 00:00:00	Guillaume	goldnord.digital@gmail.com	178	660	Beauvais	\N	1 bague	0711111111	12	25	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1BhP4RZ6jIm-BGrIauFuTBQTrWnehUAb9/view?usp=drivesdk	https://drive.google.com/file/d/1xv_Bc3xuZvJQbmpjnj_uz-Do0kKJilVk/view?usp=drivesdk	f	f
23	2025-04-12 00:00:00	Guillaume	goldnord.digital@gmail.com	12750	5255.1	Beauvais	\N	1 bague, pions, 1x10F Marianne	0711111111	2414.5	50	virement	85bis avenue de France 	59600	Beauvais	https://drive.google.com/file/d/1M8E1MWwTurk_IsW6BGrp1Cz4uafa94xG/view?usp=drivesdk	https://drive.google.com/file/d/1N3yM7ajLagUrHvXXdYvgBgAfEkhrg6Aj/view?usp=drivesdk	f	f
7	2025-04-09 00:00:00	Guillaume	goldnord.digital@gmail.com	857	550	Fourmies	\N	Bracelet	0711111111	10	42	virement	85bis avenue de France 	59600	Ohain	https://drive.google.com/file/d/1xu5tw-roRUJ0THqoosqUIVI1x9tUnwaF/view?usp=drivesdk	https://drive.google.com/file/d/1iZ8EGIlnuGi0egHvh1gRcEnrY4zufXx2/view?usp=drivesdk	f	f
8	2025-04-09 00:00:00	Guillaume	goldnord.digital@gmail.com	05	1100	Fourmies	\N	bague	0711111111	20	05	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1uhHBgzpxmjeXI3yRV2NF-PS_vQVhbFFr/view?usp=drivesdk	https://drive.google.com/file/d/1FCD-J9MuFi4XbArL16ytvVzyDrjJhXrG/view?usp=drivesdk	f	f
9	2025-04-09 00:00:00	Guillaume	goldnord.digital@gmail.com	06	5500	Fourmies	\N	Bracelet	0711111111	100	06	cheque	85bis avenue de France 	59600	Maubeuge	\N	\N	f	f
12	2025-04-10 00:00:00	Guillaume	goldnord.digital@gmail.com	01	30	Chaumont	\N	bague	0711111111	100	01	cheque	85bis avenue de France 	59600	chaumont	https://drive.google.com/file/d/1hZGeK-lWhDOJOHEM7cWYR-JAzW6AltyP/view?usp=drivesdk	https://drive.google.com/file/d/1spSSNCWkVkJyCPhEvhEMjoRXlMcBfupu/view?usp=drivesdk	f	f
13	2025-04-11 00:00:00	Guillaume	goldnord.digital@gmail.com	01	60	Saint-Quentin	\N	1 bague	0711111111	3	01	cheque	85bis avenue de France 	59600	Saint-Quentin	\N	\N	f	f
14	2025-04-11 00:00:00	Guillaume	goldnord.digital@gmail.com	02	168.69	Saint-Quentin	\N	1 bague, bracelet, boucle d'oreille, bague	0711111111	15.3	02	cheque	85bis avenue de France 	59600	Saint-Quentin	\N	\N	f	f
15	2025-04-11 00:00:00	Guillaume	goldnord.digital@gmail.com	225	4624.92	Saint-Quentin	\N	10x10f marianne, 1 bague	0711111111	67.73	03	cheque	85bis avenue de France 	59600	Saint-Quentin	https://drive.google.com/file/d/1zLOG818IjR6UaL8Ohce-H3GhYndROKx9/view?usp=drivesdk	https://drive.google.com/file/d/1mJN8jQ4IqJa4Ht0LUb9H461FdSN1ZMJS/view?usp=drivesdk	f	f
2	2025-04-08 00:00:00	Guillaume	goldnord.digital@gmail.com	04	400	Dourdan	\N	bague	0711111111	20	14	virement	85bis avenue de France 	59600	Maubeuge	\N	\N	f	f
1	2025-04-08 00:00:00	Guillaume	goldnord.digital@gmail.com	03	750	Dourdan	\N	boucle d'oreille	0711111111	15	03	cheque	80 avenue de france 	59600	Maubeuge	\N	\N	f	f
25	2025-04-15 00:00:00	Guillaume	goldnord.digital@gmail.com	156	11126.25	\N	13	25x20F Marianne	0711111111	161.25	07	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1-2hE04IIz-eOHEEy4O_B3bDzLXzJKWVq/view?usp=drivesdk	https://drive.google.com/file/d/1QaHUSUiHwYDJ2gmTYWybOwPlHis0g7z1/view?usp=drivesdk	t	t
26	2025-04-16 00:00:00	Guillaume	goldnord.digital@gmail.com	1475	75334		14	5 bague, 1 lingot 	0711111111	24	47	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1bTNI12wICen7TeNISozdIQ1IJC-FsNtv/view?usp=drivesdk	https://drive.google.com/file/d/1sJ007vKrT4MJWEv6s8rTLBCnTzFXVVyB/view?usp=drivesdk	t	f
27	2025-04-18 00:00:00	Guillaume	goldnord.digital@gmail.com	12224	84000	Maubeuge	13	1 lingot	0711111111	1000	29	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1J728QNYTs2fglgJ7V-MTIB6oDZfWBr1-/view?usp=drivesdk	https://drive.google.com/file/d/1nd_WksSf3Cy_X-82Ez_RtdWPrT40bWsP/view?usp=drivesdk	t	t
29	2025-04-19 00:00:00	Test	goldnord.digital@gmail.com	12754	168000	Maubeuge	13	2 Lingots	0711111111	2000	44	cheque	85bis avenue de France 	59600	Maubeuge	\N	\N	t	t
30	2025-04-22 00:00:00	Guillaume	goldnord.digital@gmail.com	03	190.85		13	1 bague	0711111111	3.47	23	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1X57zbpBETlLQXVGLHUHBXNkB68U566a7/view?usp=drivesdk	https://drive.google.com/file/d/1ITAow9TgtpbhtMpFW4YgZRmAbq5N2Ebh/view?usp=drivesdk	f	f
31	2025-04-11 00:00:00	Splimont	goldnord.digital@gmail.com	102	36.26	Fourmies	17	2 boucles oreilles	0745712586	0.74	2	cheque	47 rue Henri Durant	59610	Fourmies	https://drive.google.com/file/d/1_fC1ySi02lM63eMl3KUXkkIaNJwV4W8o/view?usp=drivesdk	https://drive.google.com/file/d/1G06CX90jL1UkErbDxQColUfLk3-sqGi3/view?usp=drivesdk	f	f
32	2025-04-11 00:00:00	Splimont	goldnord.digital@gmail.com	102	36.26	Fourmies	17	2 boucles oreilles	0745712586	0.74	2	cheque	47 rue Henri Durant	59610	Fourmies	https://drive.google.com/file/d/1AxaLIJZPDp2JrV93kbQUfnci0yF8TDGf/view?usp=drivesdk	https://drive.google.com/file/d/1-cqepg8RciGWhefzQ5167ka5MCZwcjee/view?usp=drivesdk	f	f
33	2025-04-11 00:00:00	Splimont	goldnord.digital@gmail.com	102	36.26	Fourmies	17	2 boucles oreilles	0745712586	0.74	02	cheque	47 rue Henri Durant	59610	Fourmies	https://drive.google.com/file/d/1B-JDZ3IgW9RRd7FOa24fhhUuiCo6LFRN/view?usp=drivesdk	https://drive.google.com/file/d/1LfeGcBNrY6aErGyqSByOEtAfOO5aWUHx/view?usp=drivesdk	f	f
34	2025-04-23 00:00:00	Leveneur	goldnord.digital@gmail.com	12810	26.36	Maubeuge	15	1 bracelet+2pièce + 1 collier	0745712586	87.99	4	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1deBEWmDV_OKmtr9d4quStFeprkAeq-4n/view?usp=drivesdk	https://drive.google.com/file/d/1SOVUgbkoSBSC382Xb18XsW46Qd1pGwcs/view?usp=drivesdk	f	f
35	2025-04-23 00:00:00	Leveneur	goldnord.digital@gmail.com	12810	26.36	Maubeuge	15	1 bracelet+2pièce + 1 collier	0745712586	87.99	4	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1iPybZOt2-HzxCX-l-Q2GiW8DOwGFwsi0/view?usp=drivesdk	https://drive.google.com/file/d/1rPoV5rldp_j7EWLZlyORSqA29RcVkzF9/view?usp=drivesdk	f	f
36	2025-04-23 00:00:00	Leveneur	goldnord.digital@gmail.com	12810	26.36	Maubeuge	15	1 bracelet+2pièce + 1 collier	0745712586	87.99	4	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/11uljORPs4KI4ZPvF62REws_VNMMD0QpF/view?usp=drivesdk	https://drive.google.com/file/d/1F7rXeiKg70_4tFmmZuVhV1xmIih1nzXs/view?usp=drivesdk	f	f
37	2025-04-23 00:00:00	test	goldnord.digital@gmail.com	03	351.45	Maubeuge	15	1 bague	0711111111	6.39	23	cheque	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1vNfe_kScouuYZZ6S4CianfrP0eFuLjlD/view?usp=drivesdk	https://drive.google.com/file/d/1OxBgWgQQtyr6LF9WZ0o9GZ00bia91MoM/view?usp=drivesdk	f	f
28	2025-04-18 00:00:00	Guillaume	goldnord.digital@gmail.com	1234	22575	Maubeuge	13	50*20F	0711111111	322.5	47	cheque	85bis avenue de France 	59600	Maubeuge	\N	\N	t	t
39	2025-04-24 00:00:00	Guillaume	goldnord.digital@gmail.com	03	262.2	Maubeuge	13	10x10f marianne	\N	3.45	42	virement	85bis avenue de France 	59600	Fourmies	https://drive.google.com/file/d/1bR0Gulfh7uz3mD5mTIiU6A0OuL7DSKsK/view?usp=drivesdk	https://drive.google.com/file/d/1oB-01oTiD68R6SAUr7EEjx8Wq4cM05QC/view?usp=drivesdk	f	f
38	2025-04-24 00:00:00	Splimont	goldnord.digital@gmail.com	05	11250	Maubeuge	13	10f marianne	test	150	03	virement	85bis avenue de France 	59600	Maubeuge	https://drive.google.com/file/d/1P1PT2gtuTEcK1zXkkHbIIo3qILYACq9P/view?usp=drivesdk	https://drive.google.com/file/d/1_ZCTkxoNVonvApoOzIu4dybytrEDpDSt/view?usp=drivesdk	t	t
40	2025-04-24 00:00:00	test	nitssei59@gmail.com	03	19000	Maubeuge	13	2 boucles oreilles	0745712586	250	47	virement	85bis avenue de France 	59600	Ohain	https://drive.google.com/file/d/1ub0jS84ZzPPZYqi3X3-fImiFls4lNWDs/view?usp=drivesdk	https://drive.google.com/file/d/1MfnEI_EKE8psI2DAIY1VGKvbt2RWsLgI/view?usp=drivesdk	t	t
\.


--
-- Data for Name: TransactionItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TransactionItem" (id, designation, carats, weight, "unitPrice", subtotal, "transactionId") FROM stdin;
1	1 bague	9	3	20	60	13
2	1 bague	18	3	55	165	14
3	bracelet, boucle d'oreille, bague	ARG	12.3	0.3	3.69	14
4	10x10f marianne	22	64.5	69	4450.5	15
5	1 bague	18	3.23	54	174.42	15
6	bague	18	10	55	550	16
7	bracelet, boucle d'oreille, bague	9	55	24	1320	16
8	1x10f marianne	22	6.45	69.71	449.6295	17
9	bracelet, boucle d'oreille, bague	18	42.3	48	2030.4	17
10	10x10f marianne	22	64.5	69.67	4493.715	18
11	1 bague	18	3.22	48	154.56	18
12	1 bague	18	10	25	250	19
13	1x1f marianne	22	6.45	69	445.05	19
14	1 bague	18	3.25	52	169	20
15	1x1f marianne	22	6.45	69	445.05	20
16	1 bague	18	3.2	55	176	21
17	1x1f marianne	22	6.45	68	438.6	21
18	1 bague	18	12	55	660	22
19	1 bague	18	3	55	165	23
20	pions	ARG	2347	0.3	704.1	23
21	1x10F Marianne	22	64.5	68	4386	23
22	1 bague	18	2.58	55	141.9	24
23	25x20F Marianne	22	161.25	69	11126.25	25
24	5 bague	18	23	58	1334	26
25	1 lingot 	24	1	74000	74000	26
26	1 lingot	24	1000	84	84000	27
27	50*20F	22	322.5	70	22575	28
28	2 Lingots	24	2000	84	168000	29
29	1 bague	18	3.47	55	190.85	30
30	2 boucles oreilles	18	0.74	49	36.26	31
31	2 boucles oreilles	18	0.74	49	36.26	32
32	2 boucles oreilles	18	0.74	49	36.26	33
33	1 bracelet+2pièce + 1 collier	ARG	87.99	0.2996	26.361804	34
34	1 bracelet+2pièce + 1 collier	ARG	87.99	0.2996	26.361804	35
35	1 bracelet+2pièce + 1 collier	ARG	87.99	0.2996	26.361804	36
36	1 bague	18	6.39	55	351.45	37
37	10f marianne	22	150	75	11250	38
38	10x10f marianne	22	3.45	76	262.2	39
39	2 boucles oreilles	22	250	76	19000	40
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, role, location) FROM stdin;
13	superadmin@goldnord.fr	$2b$10$HMnEzi7J669q/MdmVtgxHuv1pe0kl0Z0.4nvh7CsmAuKsUIRX1Dxi	superadmin	\N
14	admin@goldnord.fr	$2b$10$cDn330N/ztLbHqwsL4Ik6.NEhPmK6EkHZ3Aud45vor4FtmfdIuoJm	admin	\N
15	maubeuge@goldnord.fr	$2b$10$LgbE1L1r0OixiXdrt4Ue4e03eM3EleSsAEB9JRH30y9Eh7n7PGhQa	agency	Maubeuge
16	beauvais@goldnord.fr	$2b$10$2vyxrUIu5WPIgZFZsEKHRuxVDZ7Tmf7hA85sILfN3.bLRuQxT6z.6	agency	Beauvais
17	fourmies@goldnord.fr	$2b$10$DzSO3wOweJLBCmKW9HWW8OZf/R.BbgXe4F8Z4eXbQYSiHRbdSV/1G	agency	Fourmies
18	chaumont@goldnord.fr	$2b$10$TG/nz5rG.MlS4gJYmxkGgeo1NQcCDy0r18JV/O9quKMTnWLOgBNfO	agency	Chaumont
19	compiegne@goldnord.fr	$2b$10$PVLzrr/zR7kw29BidzlSyum9A2jXEY3Vy3De5KUneTZOkCD/SWocG	agency	Compiègne
20	dourdan@goldnord.fr	$2b$10$iAmGuBQBqgKbry5c9xIXxOJDZgq5GPLk/pTa8DCjCyrOKjAk32spi	agency	Dourdan
21	dreux@goldnord.fr	$2b$10$D9RtPgivM/klNqKXvvxcU./KAp344Cj6SYeu.30Z74vhRUIapdSfW	agency	Dreux
22	aurillac@goldnord.fr	$2b$10$llumv3H4eSigVRzCU27h6ecfhsVhU6BOfJLxfOytdpdeYOmg5HZoi	agency	Aurillac
23	saint-dizier@goldnord.fr	$2b$10$.vyRlBCAJLAIsCmd5.m9OOQ17/zLg1WB0s7eruy0zZsXliVlOOsAG	agency	Saint-Dizier
24	saint-quentin@goldnord.fr	$2b$10$CT55/FUpu/kdzpuRzblPT.UDB10JT0kIKabp.bG2YgSfTj5g0TA4G	agency	Saint-Quentin
25	puy-en-velay@goldnord.fr	$2b$10$.cR9tBQ1XKLTup9VVt3gTuZ5EXr5paSiZFBbhVc4T0T90IaGeCaXO	agency	Puy-En-Velay
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
b420304d-1af7-4503-9730-7e86f7c89c4a	d34fcd73a0b93337be78cf2d356a20295e7493ee17f04a4f568eed8e42aad942	2025-04-08 16:16:48.964558+02	20250318100028_init	\N	\N	2025-04-08 16:16:48.951114+02	1
c3db662a-5d81-4a62-af04-69a9613d490a	215b7f4f5d6c7a0c80d3be60af19d4168d862c90356634e95ef4be7b46a4b0c1	2025-04-08 16:16:48.97044+02	20250318143128_remove_user_relation	\N	\N	2025-04-08 16:16:48.966007+02	1
d672a27f-f624-4a6a-924c-0a08bea554e5	4d05101bf141b466bd86e6fa676fd3621f8f501f0994cba574d1aaed05ae54d6	2025-04-08 16:16:48.975599+02	20250318152437_add_user_transaction_relation	\N	\N	2025-04-08 16:16:48.971526+02	1
4b19e195-6170-4b4d-a635-2cfe8bc5df98	4b83dce623010f7ee36ea485ebd4b784e46e3ff9b867025a3a8990b4deb279f5	2025-04-08 16:16:48.98013+02	20250327090642_update_transaction_schema	\N	\N	2025-04-08 16:16:48.976881+02	1
a4395631-6dde-4324-96a3-f84a972be51a	4ba004629b088315e988650b41ed097f74e4f674a2dfa2d2573127852e0a8854	2025-04-08 16:16:48.984367+02	20250327091246_update_transaction_schema	\N	\N	2025-04-08 16:16:48.980695+02	1
0d23fe00-2b88-47f6-9671-1ed3fa563120	25e0bcc316cb07d43f4cd07f0ff7478bd19e34978134152f827df5a995ad717c	2025-04-08 16:16:48.993284+02	20250408091844_update_carats_field_to_string	\N	\N	2025-04-08 16:16:48.985441+02	1
96d04ff3-5953-48b1-ba45-74d4e47ce483	02c6d585573d024663351abd68d9a5dab999df2651b162dadd9967cad773553c	2025-04-08 16:16:48.997858+02	20250408121437_add_facture_number_and_paiement	\N	\N	2025-04-08 16:16:48.99427+02	1
5011effc-c175-488b-bdf1-f5a96fe7756e	196845d2ea13de1063965b023792a53242b1fd0207ef80aafdbfd30a02086dea	2025-04-08 16:16:49.002692+02	20250408141402_add_adresse_field	\N	\N	2025-04-08 16:16:48.99871+02	1
8ddddb3e-6157-43d2-8151-19127b8e0736	36e2ddd4b84725daf910aecd74e51d4c318506658da19620c81c2cf058475d9f	2025-04-08 16:24:01.347246+02	20250408142401_change_code_postal_to_string	\N	\N	2025-04-08 16:24:01.335463+02	1
1032fae9-844a-4432-ad1b-8a83f8eb3ea4	7dc51dd7353f93da46264df97417e2f499a11e0278a8321e83a282d2e21bb3e9	2025-04-09 11:10:18.537452+02	20250409091018_update_schema	\N	\N	2025-04-09 11:10:18.529677+02	1
da3f2913-4022-45a4-8e7f-df590fc10919	a46e08e62f44b1493a800c218fe6c7e283009b0b1cf2e61f4468cf5466ae8017	2025-04-10 15:34:58.576344+02	20250410133458_update_schema	\N	\N	2025-04-10 15:34:58.547495+02	1
58b7df59-dc03-49ac-9c4e-fb03c998bda7	02139a7aad72697d3fb9b816ce696c41c34d88a8a34e13539ac74f4aabd7fe0e	2025-04-16 14:22:56.072899+02	20250416122256_add_fraud_fields	\N	\N	2025-04-16 14:22:56.067568+02	1
\.


--
-- Name: TransactionItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."TransactionItem_id_seq"', 39, true);


--
-- Name: Transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Transaction_id_seq"', 40, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 25, true);


--
-- Name: TransactionItem TransactionItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransactionItem"
    ADD CONSTRAINT "TransactionItem_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: TransactionItem TransactionItem_transactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransactionItem"
    ADD CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES public."Transaction"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Transaction Transaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO goldn;


--
-- Name: TABLE "Transaction"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."Transaction" TO goldn;


--
-- Name: TABLE "TransactionItem"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."TransactionItem" TO goldn;


--
-- Name: SEQUENCE "TransactionItem_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public."TransactionItem_id_seq" TO goldn;


--
-- Name: SEQUENCE "Transaction_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public."Transaction_id_seq" TO goldn;


--
-- Name: TABLE "User"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."User" TO goldn;


--
-- Name: SEQUENCE "User_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public."User_id_seq" TO goldn;


--
-- Name: TABLE _prisma_migrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public._prisma_migrations TO goldn;


--
-- PostgreSQL database dump complete
--


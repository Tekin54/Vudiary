--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: eintraege; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eintraege (
    page integer,
    title text,
    description text,
    date text,
    ort text,
    mood integer,
    "straße" text,
    plz integer,
    id integer NOT NULL,
    "time" text,
    last_changed_date text,
    last_changed_time text,
    last_changed text
);


ALTER TABLE public.eintraege OWNER TO postgres;

--
-- Name: eintraege_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eintraege_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.eintraege_id_seq OWNER TO postgres;

--
-- Name: eintraege_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eintraege_id_seq OWNED BY public.eintraege.id;


--
-- Name: eintraege id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eintraege ALTER COLUMN id SET DEFAULT nextval('public.eintraege_id_seq'::regclass);


--
-- Data for Name: eintraege; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eintraege (page, title, description, date, ort, mood, "straße", plz, id, "time", last_changed_date, last_changed_time, last_changed) FROM stdin;
1	numero uno	<b>sdvsfs</b><div><b><br></b></div><div><b><i>fdsdfsd</i></b></div>	11.3.2024 11:28:15	Wien	3	Rahlstiege	1060	152	11:28:01	11.3.2024	11:28:27	11.3.2024 11:28:27
\.


--
-- Name: eintraege_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eintraege_id_seq', 153, true);


--
-- PostgreSQL database dump complete
--


-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "bets";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "groups";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "reference";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "sports";

-- CreateTable
CREATE TABLE "auth"."sessions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "refresh_token_hash" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6),
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."user_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_roles_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "mail" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role_id" INTEGER,

    CONSTRAINT "users_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bets"."bets" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "home_goals" INTEGER,
    "away_goals" INTEGER,
    "user_id" INTEGER NOT NULL,
    "betting_session_id" INTEGER NOT NULL,
    "points" INTEGER,

    CONSTRAINT "bets_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bets"."betting_sessions" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "betting_sessions_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bets"."standings" (
    "id" SERIAL NOT NULL,
    "betting_session_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "standings_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups"."groups" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups"."invitation_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "status_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups"."invitations" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "invited_user_id" INTEGER NOT NULL,
    "invited_by_user_id" INTEGER,
    "status_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP + '7 days'::interval),
    "read_at" TIMESTAMPTZ(6),

    CONSTRAINT "invitations_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups"."member_roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "member_roles_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups"."members" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference"."countries" (
    "code" CHAR(2) NOT NULL,
    "name" TEXT,

    CONSTRAINT "countries_pk" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "sports"."clubs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country_id" CHAR(2),
    "logo_filename" TEXT,

    CONSTRAINT "clubs_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports"."competition_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "competition_types_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports"."competitions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country_id" CHAR(2),
    "organizer_id" INTEGER,
    "type_id" INTEGER,
    "logo_filename" TEXT,

    CONSTRAINT "competitions_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports"."match_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "match_status_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports"."matches" (
    "id" SERIAL NOT NULL,
    "competition_id" INTEGER NOT NULL,
    "home_id" INTEGER NOT NULL,
    "away_id" INTEGER NOT NULL,
    "stadium_id" INTEGER,
    "kickoff_at" TIMESTAMPTZ(6),
    "home_goals" INTEGER,
    "away_goals" INTEGER,
    "round" TEXT,
    "status_id" INTEGER,
    "season_id" INTEGER,

    CONSTRAINT "matches_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports"."organizations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "organizations_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports"."seasons" (
    "id" SERIAL NOT NULL,
    "competition_id" INTEGER,
    "name" TEXT,
    "start_date" DATE,
    "end_date" DATE,

    CONSTRAINT "seasons_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports"."stadiums" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country_id" CHAR(2),
    "opened_year" SMALLINT,
    "capacity" INTEGER,
    "city" TEXT,

    CONSTRAINT "stadiums_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports"."standings" (
    "id" SERIAL NOT NULL,
    "club_id" INTEGER NOT NULL,
    "season_id" INTEGER NOT NULL,
    "played" INTEGER,
    "wins" INTEGER,
    "draws" INTEGER,
    "losses" INTEGER,
    "goals_for" INTEGER,
    "goals_against" INTEGER,
    "points" INTEGER,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "standings_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sessions_unique_refresh_token_hash" ON "auth"."sessions"("refresh_token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "users_unique" ON "auth"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_unique_mail" ON "auth"."users"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "bets_unique" ON "bets"."bets"("match_id", "user_id", "betting_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "betting_sessions_unique" ON "bets"."betting_sessions"("group_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "standings_unique" ON "bets"."standings"("betting_session_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_unique" ON "groups"."groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "members_unique" ON "groups"."members"("group_id", "user_id");

-- AddForeignKey
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "fk_sessions_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."users" ADD CONSTRAINT "fk_users_role_id" FOREIGN KEY ("role_id") REFERENCES "auth"."user_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets"."bets" ADD CONSTRAINT "fk_bets_betting_session_id" FOREIGN KEY ("betting_session_id") REFERENCES "bets"."betting_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets"."bets" ADD CONSTRAINT "fk_bets_match_id" FOREIGN KEY ("match_id") REFERENCES "sports"."matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets"."bets" ADD CONSTRAINT "fk_bets_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets"."betting_sessions" ADD CONSTRAINT "fk_betting_sessions_competition_id" FOREIGN KEY ("competition_id") REFERENCES "sports"."competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets"."betting_sessions" ADD CONSTRAINT "fk_betting_sessions_group_id" FOREIGN KEY ("group_id") REFERENCES "groups"."groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets"."betting_sessions" ADD CONSTRAINT "fk_betting_sessions_season_id" FOREIGN KEY ("season_id") REFERENCES "sports"."seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets"."standings" ADD CONSTRAINT "fk_standings_betting_session_id" FOREIGN KEY ("betting_session_id") REFERENCES "bets"."betting_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets"."standings" ADD CONSTRAINT "fk_standings_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups"."invitations" ADD CONSTRAINT "fk_invitations_group_id" FOREIGN KEY ("group_id") REFERENCES "groups"."groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups"."invitations" ADD CONSTRAINT "fk_invitations_invited_by_user_id" FOREIGN KEY ("invited_by_user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups"."invitations" ADD CONSTRAINT "fk_invitations_invited_user_id" FOREIGN KEY ("invited_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups"."invitations" ADD CONSTRAINT "fk_invitations_status_id" FOREIGN KEY ("status_id") REFERENCES "groups"."invitation_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups"."members" ADD CONSTRAINT "fk_members_group_id" FOREIGN KEY ("group_id") REFERENCES "groups"."groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups"."members" ADD CONSTRAINT "fk_members_role_id" FOREIGN KEY ("role_id") REFERENCES "groups"."member_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups"."members" ADD CONSTRAINT "fk_members_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."clubs" ADD CONSTRAINT "fk_clubs_country_id" FOREIGN KEY ("country_id") REFERENCES "reference"."countries"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."competitions" ADD CONSTRAINT "fk_competitions_country_id" FOREIGN KEY ("country_id") REFERENCES "reference"."countries"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."competitions" ADD CONSTRAINT "fk_competitions_organizer_id" FOREIGN KEY ("organizer_id") REFERENCES "sports"."organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."competitions" ADD CONSTRAINT "fk_competitions_type_id" FOREIGN KEY ("type_id") REFERENCES "sports"."competition_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."matches" ADD CONSTRAINT "fk_matches_away_id" FOREIGN KEY ("away_id") REFERENCES "sports"."clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."matches" ADD CONSTRAINT "fk_matches_competition_id" FOREIGN KEY ("competition_id") REFERENCES "sports"."competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."matches" ADD CONSTRAINT "fk_matches_home_id" FOREIGN KEY ("home_id") REFERENCES "sports"."clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."matches" ADD CONSTRAINT "fk_matches_season_id" FOREIGN KEY ("season_id") REFERENCES "sports"."seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."matches" ADD CONSTRAINT "fk_matches_stadium_id" FOREIGN KEY ("stadium_id") REFERENCES "sports"."stadiums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."matches" ADD CONSTRAINT "fk_matches_status_id" FOREIGN KEY ("status_id") REFERENCES "sports"."match_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."seasons" ADD CONSTRAINT "fk_seasons_competition_id" FOREIGN KEY ("competition_id") REFERENCES "sports"."competitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."stadiums" ADD CONSTRAINT "fk_stadiums_country_id" FOREIGN KEY ("country_id") REFERENCES "reference"."countries"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."standings" ADD CONSTRAINT "fk_standings_club_id" FOREIGN KEY ("club_id") REFERENCES "sports"."clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports"."standings" ADD CONSTRAINT "fk_standings_season_id" FOREIGN KEY ("season_id") REFERENCES "sports"."seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

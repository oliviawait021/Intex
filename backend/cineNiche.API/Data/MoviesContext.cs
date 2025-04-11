using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace cineNiche.API.Data;

public partial class MoviesContext : DbContext
{
    public MoviesContext()
    {
    }

    public MoviesContext(DbContextOptions<MoviesContext> options)
        : base(options)
    {
    }

    public virtual DbSet<MoviesRating> MoviesRatings { get; set; }

    public virtual DbSet<MoviesTitle> MoviesTitles { get; set; }

    public virtual DbSet<MoviesUser> MoviesUsers { get; set; }

    public virtual DbSet<BecauseMovie> allContent_recs { get; set; }
    public virtual DbSet<MoviesForYou> user_recs_all { get; set; }
    public virtual DbSet<SimilarMovies> hybrid { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MoviesRating>(entity =>
        {
            entity.HasKey(e => new { e.user_id, e.show_id });

            entity.ToTable("movies_ratings");

            entity.Property(e => e.user_id).HasColumnName("user_id");
            entity.Property(e => e.show_id).HasColumnName("show_id");
            entity.Property(e => e.rating).HasColumnName("rating");
        });

        modelBuilder.Entity<MoviesTitle>(entity =>
        {
            entity.HasKey(m => m.show_id);

            entity.ToTable("movies_titles");

            entity.Property(e => e.show_id).HasColumnName("show_id");
            entity.Property(e => e.type).HasColumnName("type");
            entity.Property(e => e.title).HasColumnName("title");
            entity.Property(e => e.director).HasColumnName("director");
            entity.Property(e => e.cast).HasColumnName("cast");
            entity.Property(e => e.country).HasColumnName("country");
            entity.Property(e => e.release_year).HasColumnName("release_year");
            entity.Property(e => e.rating).HasColumnName("rating");
            entity.Property(e => e.duration).HasColumnName("duration");
            entity.Property(e => e.description).HasColumnName("description");
            entity.Property(e => e.Action).HasColumnName("Action");
            entity.Property(e => e.Adventure).HasColumnName("Adventure");
            entity.Property(e => e.Anime_Series_International_TV_Shows).HasColumnName("Anime_Series_International_TV_Shows");
            entity.Property(e => e.British_TV_Shows_Docuseries_International_TV_Shows).HasColumnName("British_TV_Shows_Docuseries_International_TV_Shows");
            entity.Property(e => e.Children).HasColumnName("Children");
            entity.Property(e => e.Comedies).HasColumnName("Comedies");
            entity.Property(e => e.Comedies_Dramas_International_Movies).HasColumnName("Comedies_Dramas_International_Movies");
            entity.Property(e => e.Comedies_International_Movies).HasColumnName("Comedies_International_Movies");
            entity.Property(e => e.Comedies_Romantic_Movies).HasColumnName("Comedies_Romantic_Movies");
            entity.Property(e => e.Crime_TV_Shows_Docuseries).HasColumnName("Crime_TV_Shows_Docuseries");
            entity.Property(e => e.Documentaries).HasColumnName("Documentaries");
            entity.Property(e => e.Documentaries_International_Movies).HasColumnName("Documentaries_International_Movies");
            entity.Property(e => e.Docuseries).HasColumnName("Docuseries");
            entity.Property(e => e.Dramas).HasColumnName("Dramas");
            entity.Property(e => e.Dramas_International_Movies).HasColumnName("Dramas_International_Movies");
            entity.Property(e => e.Dramas_Romantic_Movies).HasColumnName("Dramas_Romantic_Movies");
            entity.Property(e => e.Family_Movies).HasColumnName("Family_Movies");
            entity.Property(e => e.Fantasy).HasColumnName("Fantasy");
            entity.Property(e => e.Horror_Movies).HasColumnName("Horror_Movies");
            entity.Property(e => e.International_Movies_Thrillers).HasColumnName("International_Movies_Thrillers");
            entity.Property(e => e.International_TV_Shows_Romantic_TV_Shows_TV_Dramas).HasColumnName("International_TV_Shows_Romantic_TV_Shows_TV_Dramas");
            entity.Property(e => e.Kids_TV).HasColumnName("Kids_TV");
            entity.Property(e => e.Language_TV_Shows).HasColumnName("Language_TV_Shows");
            entity.Property(e => e.Musicals).HasColumnName("Musicals");
            entity.Property(e => e.Nature_TV).HasColumnName("Nature_TV");
            entity.Property(e => e.Reality_TV).HasColumnName("Reality_TV");
            entity.Property(e => e.Spirituality).HasColumnName("Spirituality");
            entity.Property(e => e.TV_Action).HasColumnName("TV_Action");
            entity.Property(e => e.TV_Comedies).HasColumnName("TV_Comedies");
            entity.Property(e => e.TV_Dramas).HasColumnName("TV_Dramas");
            entity.Property(e => e.Talk_Shows_TV_Comedies).HasColumnName("Talk_Shows_TV_Comedies");
            entity.Property(e => e.Thrillers).HasColumnName("Thrillers");
            entity.Property(e => e.Genre).HasColumnName("Genre");
        });

        modelBuilder.Entity<MoviesUser>(entity =>
        {
            entity.HasKey(e => e.user_id);
            entity.ToTable("movies_users");

            entity.Property(e => e.user_id).HasColumnName("user_id");
            entity.Property(e => e.name).HasColumnName("name");
            entity.Property(e => e.phone).HasColumnName("phone");
            entity.Property(e => e.email).HasColumnName("email");
            entity.Property(e => e.age).HasColumnName("age");
            entity.Property(e => e.gender).HasColumnName("gender");
            entity.Property(e => e.Netflix).HasColumnName("Netflix");
            entity.Property(e => e.Amazon_Prime).HasColumnName("Amazon_Prime");
            entity.Property(e => e.Disney).HasColumnName("Disney");
            entity.Property(e => e.Paramount).HasColumnName("Paramount");
            entity.Property(e => e.Max).HasColumnName("Max");
            entity.Property(e => e.Hulu).HasColumnName("Hulu");
            entity.Property(e => e.Apple_TV).HasColumnName("Apple_TV");
            entity.Property(e => e.Peacock).HasColumnName("Peacock");
            entity.Property(e => e.city).HasColumnName("city");
            entity.Property(e => e.state).HasColumnName("state");
            entity.Property(e => e.zip).HasColumnName("zip");
        });

        modelBuilder.Entity<BecauseMovie>(entity =>
        {
            entity.HasKey(e => new { e.source_show_id, e.recommended_show_id });

            entity.ToTable("allContent_recs");

            entity.Property(e => e.source_show_id).HasColumnName("source_show_id");
            entity.Property(e => e.recommended_show_id).HasColumnName("recommended_show_id");
            entity.Property(e => e.similarity_score).HasColumnName("similarity_score");
        });

        modelBuilder.Entity<MoviesForYou>(entity =>
        {
            entity.HasKey(e => e.user_id); 

            entity.ToTable("user_recs_all");

            entity.Property(e => e.user_id).HasColumnName("user_id");
            entity.Property(e => e.recommendation_1).HasColumnName("recommendation_1");
            entity.Property(e => e.recommendation_2).HasColumnName("recommendation_2");
            entity.Property(e => e.recommendation_3).HasColumnName("recommendation_3");
            entity.Property(e => e.recommendation_4).HasColumnName("recommendation_4");
            entity.Property(e => e.recommendation_5).HasColumnName("recommendation_5");
            entity.Property(e => e.recommendation_6).HasColumnName("recommendation_6");
            entity.Property(e => e.recommendation_7).HasColumnName("recommendation_7");
            entity.Property(e => e.recommendation_8).HasColumnName("recommendation_8");
            entity.Property(e => e.recommendation_9).HasColumnName("recommendation_9");
            entity.Property(e => e.recommendation_10).HasColumnName("recommendation_10");
            entity.Property(e => e.recommendation_11).HasColumnName("recommendation_11");
            entity.Property(e => e.recommendation_12).HasColumnName("recommendation_12");
            entity.Property(e => e.recommendation_13).HasColumnName("recommendation_13");
            entity.Property(e => e.recommendation_14).HasColumnName("recommendation_14");
            entity.Property(e => e.recommendation_15).HasColumnName("recommendation_15");
            entity.Property(e => e.recommendation_16).HasColumnName("recommendation_16");
            entity.Property(e => e.recommendation_17).HasColumnName("recommendation_17");
            entity.Property(e => e.recommendation_18).HasColumnName("recommendation_18");
            entity.Property(e => e.recommendation_19).HasColumnName("recommendation_19");
            entity.Property(e => e.recommendation_20).HasColumnName("recommendation_20");
        });

        modelBuilder.Entity<SimilarMovies>(entity =>
        {
            entity.HasKey(e => e.show_id); 

            entity.ToTable("hybrid");

            entity.Property(e => e.show_id).HasColumnName("show_id");
            entity.Property(e => e.recommendation).HasColumnName("recommendation");
            entity.Property(e => e.distance_content).HasColumnName("distance_content");
            entity.Property(e => e.distance_collab).HasColumnName("distance_collab");
            entity.Property(e => e.norm_content).HasColumnName("norm_content");
            entity.Property(e => e.norm_collab).HasColumnName("norm_collab");
            entity.Property(e => e.final_score).HasColumnName("final_score");
        });


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
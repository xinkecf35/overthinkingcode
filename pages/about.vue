<template>
  <main id="about-content">
    <article>
      <h1>About</h1>
      <div class="about-row">
        <p>
          I am Xinke Chen, webmaster and author of this blog you're currently on
          right now. I have a B.S. Computer Science from the University of
          Pittsburgh with a Minor in Economics. As you might expect, I care
          quite about technology, specifically, in experimenting with it. In my
          journey in becoming a better software engineer, I have played with and
          tried to learn quite a few different frameworks, languages and
          ecosystems. From iOS with Objective-C and Swift, to PostgreSQL and Vue
          with JavaScript, my curiosity with technology and software is quite
          diverse.
        </p>
        <img src="~/assets/images/profile.jpg" alt="picture of Xinke Chen" />
      </div>
      <div class="about-row">
        <p>
          Beyond just computers, I also love photography and specifically, astro
          and night landscapes. Again, along with the theme of experimenting
          (and also as a constraint of my location), I like these type of
          subjects specifically to see how far I push the camera technically, to
          see what even the eye can't see. There's something special in
          capturing something that otherwise would not exist were it not for the
          presence and ability of the camera.
        </p>
        <img
          src="~/assets/images/cathedral-startrails.jpg"
          alt="Startrails over the Cathedral of Learning (Pittsburgh Oct. 2017)"
        />
      </div>
      <div class="about-row">
        <div>
          <h2>What is "Overthinking Code"?</h2>
          <p>
            Overthinking Code, the blog itself, is largely created and devised
            as a journaling device for myself; to keep track of tools and things
            I find usefu or interesting and thereby maybe of use in the future.
            Additionally, as an journaling tool, it's also a place for me to
            reflect on my own career, albeit a reflection with a heavy technical
            focus.
          </p>
        </div>
      </div>
      <div class="about-row">
        <p>
          The title, is also a reflection of a personal habit of one, one that's
          argubly not great but also has been one of the causes as to why I've
          experimented with so much. As a result of overthinking an issue or
          problem, I pursued a great deal of solutions and implementations that
          often while overbuilt or could've been down simpler have down the line
          been incredibly useful later on. I believe that effectively asking
          "what if?" is a good thing, and something I feel is worth encouraging
          (in that right circumstances of course).
        </p>
      </div>
    </article>
  </main>
</template>

<script>
export default {};
</script>

<style lang="scss">
#about-content {
  box-sizing: border-box;
  font-size: 20px;
  margin-bottom: 20vh;
  max-width: $content-max-width + 20;
  text-align: left;
  width: 85%;
  h1 {
    font-size: 2.75em;
  }
  h2 {
    font-size: 1.75em;
    margin: 0 0 0.5em 0;
  }
}
.about-row {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 1em 0 0 0;
  p {
    display: block;
    flex: 2 1 50%;
    line-height: 1.4em;
  }
  img {
    box-sizing: border-box;
    display: block;
    flex: 1 1 auto;
    height: auto;
    width: 25%;
    margin: 0 1em 0 1em;
  }
  @media screen and (max-width: $tablet-max-width - 1) {
    flex-direction: column;
    margin: 1em 0 1em 0;
    img {
      height: 20%;
      min-width: 250px;
      margin: 1em;
      justify-self: center;
    }
  }
}
</style>

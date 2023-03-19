import Head from 'next/head'

import styles from '../styles/Home.module.scss'

import posts from '../data/posts.json';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>My Space Jelly Blog</title>
        <meta name="description" content="Awesome tutorials!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          My Notes
        </h1>

        <ul className={styles.posts}>
          {posts.map(post => {
            return (
              <li key={post.id}>
                <a href={`https://spacejelly.dev/posts/${post.slug}`}>
                  <h3 className={styles.postTitle}>{ post.title }</h3>
                  <p className={styles.postDate}>{ new Date(post.date).toDateString() }</p>
                  <div className={styles.postExcerpt} dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                </a>
              </li>
            )
          })}
        </ul>

      </main>

      <footer className={styles.footer}>
        <p>Find the tutorial on <a href="https://spacejelly.dev/">spacejelly.dev</a>!</p>
      </footer>
    </div>
  )
}

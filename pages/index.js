import { useState, useRef } from 'react';
import Link from 'next/link'
import Head from 'next/head'
import { getAuth } from "@clerk/nextjs/server";
import { SignIn } from "@clerk/nextjs";

import { getPosts } from '../lib/posts';

import styles from '../styles/Home.module.scss'

export default function Home({ posts }) {
  async function handleOnSubmit(e) {
    e.preventDefault();
    try {
      await fetch('/api/posts/create', {
        method: 'POST',
        body: JSON.stringify({
          blocks: `Test Text`
        })
      }).then(r => r.json());
    } catch(e) {
      setError(e.message);
    }
  }

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
        
        <div className={styles.editor}>
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>

        <form>
          <div>
            <input type="text" style={{
              border: 'none',
              backgroundColor: 'white',
              borderRadius: 'none'
            }} />
          </div>
          <p>
            <button onClick={handleOnSubmit}>Submit</button>
          </p>
        </form>

        <ul className={styles.posts}>
          {posts?.map(post => {
            return (
              <li key={post.id}>
                <Link href={`/posts/${post.slug}`}>
                  <h3 className={styles.postTitle}>{ post.title }</h3>
                  <p className={styles.postDate}>
                    Created: { new Date(post.createdAt).toDateString() }
                    <br />
                    Updated: { new Date(post.updatedAt).toDateString() }
                  </p>
                  {/* <div className={styles.postExcerpt} dangerouslySetInnerHTML={{ __html: post.excerpt }} /> */}
                </Link>
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

export async function getServerSideProps(ctx) {
  const { getToken, userId } = getAuth(ctx.req)
  const token = await getToken();
  console.log('userId', userId)

  if (!token) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    }
  }

  let posts;

  try {
    posts = await getPosts({ token, userId })
  } catch(e) {}

  return {
    props: {
      posts: posts || null
    }
  }
}
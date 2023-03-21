import { GetStaticProps } from "next";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import PortableText from "react-portable-text";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../lib/sanity.client";
import { Post } from "../../typing";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";

interface Props {
  posts: Post;
}

type Inputs = {
  _id: string;
  name: string;
  email: string;
  comment: string;
};

const PostSlug = ({ posts }: Props) => {
  const { data: session } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [useErro, setUseErro] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);

    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        setSubmitted(false);
      });
  };

  const handleUserError = () => {
    if (!session) {
      setUseErro("Please sign in to comment");
    } else {
      setUseErro("");
    }
  };
  return (
    <div>
      <Header />
      {/* {main image} */}
      <img
        src={urlFor(posts.mainImage).url()!}
        alt="coverImage"
        width={380}
        height={180}
        className="w-full h-96 object-cover "
      />
      {/* Artical */}
      <div className="max-w-3xl mx-auto mb-10">
        <article className="w-fill mx-auto p-5 bg-secondaryColor/10">
          <h1 className="font-titleFont font-medium text-[32px] text-primary border-b-[1px] border-b-cyan-800 mt-10 mb-3">
            {posts.title}
          </h1>
          <h2 className="font-bodyFont text-[18px] text-gray-500 mb-2">
            {posts.description}
          </h2>
          <div className="flex items-center gap-2">
            <img
              src={urlFor(posts.author.image).url()!}
              alt="authorImg"
              className="rounded-full w-12 h-12 object-cover bg-red-400"
            />
            <p className="font-bodyFont text-base">
              Blog post by <span>{posts.author.name}</span> - Published at{" "}
              {new Date(posts.publishedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-10">
            <PortableText
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
              content={posts.body}
              serializers={{
                h1: (props: any) => (
                  <h1
                    className="text-3xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                h2: (props: any) => (
                  <h1
                    className="text-2xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                h3: (props: any) => (
                  <h1
                    className="text-2xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                li: ({ href, children }: any) => (
                  <a href={href} className="text-cyan-500 hover:underline">
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        </article>
        <hr className="max-w-lg my-5 mx-auto border[1px] border-secondaryColor" />
        {submitted ? (
          <div className="flex fle -col item-center gap-6 p-10 my-10 bg-bgColor text-white Once it has been Approbed, it will below">
            <h1 className="text-2xl ">Thank you for submitting you comment</h1>
            <h1>text-white Once it has been Approbed, it will below</h1>
          </div>
        ) : (
          <div>
            <p className="text-xs text-secondaryColor uppercase font-titleFont font-bold">
              Enjoyed this article?
            </p>
            <h3 className="font-titleFont text-3xl font-bold">
              Leave a comment below
            </h3>
            <hr className=" py-3 mt-2" />

            {/* Form will start here */}
            {/* Generate Id for hooks form */}
            <input
              {...register("_id")}
              type="hidden"
              name="_id"
              value={posts._id}
            />
            <form
              className=" flex-col gap-6 mt-7 flex"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label htmlFor="name" className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Name
                </span>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  placeholder="Enter your name"
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                />
                {/*  Error name */}
                {errors.name && (
                  <p className="text-base font-titleFont font-semibold text-red-500 my-1 px-4">
                    !
                    <span className="text-base font-bold italic">
                      Name is required
                    </span>
                  </p>
                )}
              </label>
              <label htmlFor="email" className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Email
                </span>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  placeholder="Enter your email"
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                />
                {/*  Error email */}
                {errors.name && (
                  <p className="text-base font-titleFont font-semibold text-red-500 my-1 px-4">
                    !
                    <span className="text-base font-bold italic">
                      Email is required
                    </span>
                  </p>
                )}
              </label>
              <label htmlFor="comment" className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Comment
                </span>
                {/*  Error comment */}
                {errors.name && (
                  <p className="text-base font-titleFont font-semibold text-red-500 my-1 px-4">
                    !
                    <span className="text-base font-bold italic">
                      Comment is required 
                    </span>
                  </p>
                )}
                <textarea
                  {...register("comment", { required: true })}
                  placeholder="Enter your comment"
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                  rows={6}
                  style={{ resize: "none" }}
                />
              </label>
              {session && (
                <button
                  className="w-full bg-bgColor text-white text-base font-titleFont font-semibold tracking-wider uppercase py-2 rounded-sm hover:bg-secondaryColor duration-300"
                  type="submit"
                >
                  Submit
                </button>
              )}
            </form>
            {!session && (
              <button
                onClick={handleUserError}
                className="w-full bg-bgColor text-white text-base font-titleFont font-semibold tracking-wider uppercase py-2 rounded-sm hover:bg-secondaryColor duration-300"
                type="submit"
              >
                Submit
              </button>
            )}

            {/* Comments */}
            <div className="w-full flex flex-col p-10 mx-auto shadow-bgColor shadow-lg space-y-2">
              <h3 className="text-3xl font-titleFont font-semibold">Comment</h3>
              <hr />
              {/* {posts.comments} */}
              {posts.comments.map((comment) => (
                <div key={comment._id}>
                  <div></div>
                  <p>
                    <span className="text-secondaryColor">{comment.name}</span>{" "}
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PostSlug;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug{
            current
        }
    }`;

  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        publishedAt,
        title,
        author ->{
          name,
         image
        },
        "comments":*[_type == "comment" && post._ref == ^._id && approved == true]{
            _id,
            name,
            approved,
            email,
            comment,
            post
        } ,
        description,
        mainImage,
        slug,
        body

    }`;

  const posts = await sanityClient.fetch(query, {
    slug: params?.slug,
  });
  if (!posts) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      posts,
    },
    revalidate: 60,
  };
};

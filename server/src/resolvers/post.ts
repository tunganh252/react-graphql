import { CreatePostInput } from "../types/CreatePostInput";
import { PostMutationResponse } from "../types/PostMutationResponse";
import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";
// import { UpdatePostInput } from "../types/UpdatePostInput";

@Resolver()
export class PostResolver {
  @Mutation((_return) => PostMutationResponse)
  async createPost(
    @Arg("createPostInput") createPostInput: CreatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const newPost = Post.create({
        title: createPostInput.title,
        text: createPostInput.text,
      });

      await newPost.save();

      return {
        code: 200,
        message: "Create post successfully",
        success: true,
        post: newPost,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Query((_return) => [Post], { nullable: true })
  async getPosts(): Promise<Post[] | null> {
    try {
      return Post.find();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Query((_return) => Post, { nullable: true })
  async getPost(
    @Arg("id", (_type) => ID) id: number
  ): Promise<Post | undefined | null> {
    const post = await Post.findOne(id);
    return post;
  }

  // @Mutation((_return) => PostMutationResponse)
  // async updatePost(
  //   @Arg("updatePostInput") updatePostInput: UpdatePostInput
  // ): Promise<PostMutationResponse> {}
}

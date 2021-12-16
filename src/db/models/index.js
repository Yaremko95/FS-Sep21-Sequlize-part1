import User from "./user.js";
import Article from "./article.js";
import Review from "./review.js";
import Category from "./category.js";
import ArticleCategory from "./articlesCategroy.js";

// 1-to-many between User and Article
User.hasMany(Article, { onDelete: "CASCADE" }); // get User including Article
Article.belongsTo(User, { onDelete: "CASCADE" }); // get Article including User

// 1-to-many between Review and Article
Article.hasMany(Review, { onDelete: "CASCADE" }); // get Article including Review
Review.belongsTo(Article, { onDelete: "CASCADE" }); // get Review including Article

// 1-to-many between User and Review
User.hasMany(Review, { onDelete: "CASCADE" }); // get User including Review
Review.belongsTo(User, { onDelete: "CASCADE" }); // get Review including User

// many-to-many between Article and Category
Article.belongsToMany(Category, {
  through: ArticleCategory, // Join table
  onDelete: "CASCADE", // if article or category will be removed, all the related rows will be removed from ArticleCategory
}); // get Article including Category
Category.belongsToMany(Article, {
  through: ArticleCategory,
  onDelete: "CASCADE",
}); // get Category including Article

export { User, Article, Review, Category, ArticleCategory };

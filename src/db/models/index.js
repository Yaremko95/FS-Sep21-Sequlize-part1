import User from "./user.js";
import Article from "./article.js";

//hasMany
//belongsTo
User.hasMany(Article, { onDelete: "CASCADE" });
Article.belongsTo(User, { onDelete: "CASCADE" });

export { User, Article };

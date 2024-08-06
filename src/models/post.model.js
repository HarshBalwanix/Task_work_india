"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Post.init(
    {
      category: {
        type: DataTypes.ENUM,
        values: ["news", "article", "post"],
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      publish_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      actual_content_link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      votes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
          upvote: 0,
          downvote: 0,
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );

  return Post;
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bodyPreview } from '../utils/utils';
import ArticleSearch from './ArticleSearch';
import TopicSelect from './TopicSelect';
const api = require('../api');

export default class ArticleList extends Component {

    state = {
        allArticles: [],
        articles : [],
        currentText: ''
    }

    render() {
        const { topic } = this.props;
        const topicName = topic ? topic.replace(/^\w/, c => c.toUpperCase()) : '';
        return (
            <div className="article_list">
                <div className="article_list_head">
                    <h2 className="article_list_title">Most Popular {topicName} Articles</h2>
                    <div><ArticleSearch handleChange={this.handleChange} handleSubmit={this.handleSubmit} /></div>
                    {topic && <button className="article_add_button"><Link to={`${topic}/articles/new`}>+ New {topicName} Article</Link></button>}
                    {!topic && <TopicSelect />}
                </div>
                <div className="article_list_scroll">
                    <ul className="article_list_scroll_ul">
                        {this.state.articles && this.state.articles.sort((a, b) => { return b.votes - a.votes }).map(article => {
                            return (
                                <li className="article_list_item" key={article._id} >
                                    <Link to={`/articles/${article._id}`}>
                                        <h4 className="article_list_item_title">{article.title}</h4>
                                        <p className="article_list_body">{bodyPreview(article.body)}</p>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }

    componentDidMount() {
        return api.fetchArticles(this.props.topic)
            .then((articles) => {
                return this.setState({
                    allArticles : articles,
                    articles
                })
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.topic !== this.props.topic) {
            return api.fetchArticles(this.props.topic)
                .then((articles) => {
                    return this.setState({
                        allArticles : articles,
                        articles
                    })
                })
        }

        if (prevState.currentText !== this.state.currentText) {
            const { allArticles, currentText } = this.state;
            return this.setState({
                articles : this.getMatches(allArticles, currentText)
            })
        }

    }

    handleChange = (e) => {
        return this.setState({
            currentText: e.target.value,
        })
    }

    getMatches = (arr, str) => {
        return arr.filter((x) => {
            return x.body.toLowerCase().includes(str.toLowerCase()) || x.title.toLowerCase().includes(str.toLowerCase())
        })
    }

}

ArticleList.propTypes = {
    topic: PropTypes.string
}
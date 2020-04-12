import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { useMutation } from 'react-apollo';
import { useSpring, animated } from 'react-spring';
import { useServerContext } from 'components/hooks/useServerContext';
import useGenerateName, { TYPES } from './useGenerateName';
import DraggableList from './DragableList';
import ToggleSwitch from './ToggleSwitch';
import Button from './Button';
import Logo from './Logo';
import AnimatedText from './AnimatedName';
import { ReactComponent as ReorderIcon } from './reorder-four.svg';
import Sharing from './Sharing';
import ContinueButton from './ContinueButton';
import ShowOptionsButton from './ShowOptionsButton';
import TextInput from './TextInput';
import './index.css';
import Counter from './Counter';
import { NAME_GENERATED } from './gql';
import { Signup } from './Signup';
import RefreshButton from './RefreshButton';

const CATEGORIES = [
    {
        key: TYPES.ADJECTIVES,
        label: 'Spicyness',
        description: 'Spice up the name with a hot word.',
    },
    {
        key: TYPES.HIPHOP,
        label: 'HipHopify',
        description: 'Add words from the hip hop culture.',
    },
    {
        key: TYPES.NAME,
        label: 'Your name',
        description: 'Include your own name.',
    },
    {
        key: TYPES.ARTISTS,
        label: 'Fame',
        description: 'Steal parts of you rname from a celebrity.',
    },
];

function App() {
    const [mutate] = useMutation(NAME_GENERATED);

    const [categories, setCategories] = useState([
        { type: TYPES.ADJECTIVES, enabled: true, order: 0 },
        { type: TYPES.HIPHOP, enabled: true, order: 1 },
        { type: TYPES.NAME, enabled: false, order: 2 },
        { type: TYPES.ARTISTS, enabled: false, order: 3 },
    ]);
    const [alliterate, setAlliterate] = useState(true);
    const mounted = useRef(false);

    const [nameText, setName] = useState();
    const categoryKeys = categories
        .filter((c) => c.enabled)
        .sort((a, b) => a.order - b.order)
        .map((c) => c.type);
    const [hasGenerated, setGenerated] = useState(false);
    const [hasAnimated, setAnimated] = useState(false);

    const [generate, { name }] = useGenerateName({
        categories: categoryKeys,
        sameFirst: alliterate,
        nameText,
    });

    useEffect(() => {
        if (hasGenerated) {
            mutate({ variables: { name } });
        }
    }, [name, mutate, hasGenerated]);

    const innerGenerate = useCallback(() => {
        setGenerated(true);
        generate();
        setSidebar(false);
    }, [generate]);

    const clickHandler = () => {
        innerGenerate();
    };

    // generate new if changing options
    useEffect(() => {
        if (mounted.current) {
            innerGenerate();
        } else {
            mounted.current = true;
        }
    }, [alliterate, nameText, innerGenerate]);

    const toggleCategory = (key, checked) => {
        if (checked) {
            setCategories((cc) => cc.map((c) => (c.type === key ? { ...c, enabled: true } : c)));
        } else {
            setCategories((cc) => cc.map((c) => (c.type === key ? { ...c, enabled: false } : c)));
        }
    };

    const onOrderChanged = (res) => {
        const withOrder = categories.map((c, idx) => ({ ...c, order: res.indexOf(idx) }));
        setCategories(withOrder);
    };

    const [signup, setSignup] = useState(false);
    const [sidebarActive, setSidebar] = useState(false);

    const appStyle = useSpring({
        transform: sidebarActive ? 'translateX(50%)' : 'translateX(0%)',
    });

    return (
        <animated.div className="app" style={appStyle}>
            <div className="left-area card">
                <div className="instructions">
                    <h2>Instructions</h2>
                    <p>
                        Find your next DJ name by clicking GENERATE. Toggle the categories to
                        customize the name - best to only use 2 at a time. There are 19 billion
                        possibilities, so play around until you find a suitable name.
                    </p>
                </div>

                <div style={{ flex: 1 }} />
                <div>
                    <DraggableList
                        onOrderChanged={onOrderChanged}
                        items={CATEGORIES.map((c) => {
                            const enabled = categories.find((el) => el.type === c.key)?.enabled;
                            return {
                                enabled,
                                Component: (
                                    <Category
                                        c={c}
                                        enabled={enabled}
                                        toggleCategory={toggleCategory}
                                        setName={setName}
                                    />
                                ),
                            };
                        })}
                    />
                    <div className="options">
                        <ToggleSwitch
                            checked={alliterate}
                            onChange={(e) => setAlliterate(e.target.checked)}
                            name="first-letter"
                            label="Alliteration (same start letter for each word)"
                        />
                    </div>
                </div>
                <div style={{ flex: 2 }} />
                <Button onClick={clickHandler} disabled={!categories.some((c) => c.enabled)}>
                    Generate
                </Button>
            </div>
            <div className="right-area">
                <div className="menu">
                    <Counter />
                    <Sharing
                        url={`/dj-name-generator${
                            hasGenerated ? '?name=' + encodeURIComponent(name) : ''
                        }`}
                    />
                </div>

                <div
                    className={'dj-name-wrapper' + (hasGenerated ? ' active' : '')}
                    onClick={() => hasGenerated && setSignup(true)}
                >
                    <h1 className="dj-name">
                        <AnimatedText content={name} onAnimated={setAnimated} />
                    </h1>
                    <div className="actions">
                        <Sharing url={`/dj-name-generator?name=${encodeURIComponent(name)}`} />
                        <ContinueButton show={hasGenerated && hasAnimated}>
                            {hasGenerated ? 'Become DJ' : "Let's go"}
                        </ContinueButton>
                    </div>
                </div>

                <Signup active={signup} close={() => setSignup(false)} name={name} />
            </div>

            <div className="created-by">
                <h4>Created by</h4>
                <Logo />
            </div>

            <div className={'mobile-action-buttons ' + (!hasGenerated ? ' hide' : '')}>
                <ShowOptionsButton onClick={() => setSidebar(true)} />
                <RefreshButton onClick={() => innerGenerate()} />
            </div>
        </animated.div>
    );
}

const Category = ({ enabled, c, toggleCategory, setName }) => {
    const withInput = c.key === TYPES.NAME;

    return (
        <div key={c.key} className={'category-content'}>
            {withInput && enabled ? <TextInput onSave={setName} /> : <h4>{c.label}</h4>}
            <div className="row">
                <ToggleSwitch
                    checked={enabled}
                    small
                    onChange={(e) => toggleCategory(c.key, e.target.checked)}
                    name={'toggle-' + c.key}
                />
                <p>{c.description}</p>
            </div>
            <ReorderIcon />
        </div>
    );
};

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const AppWithMeta = () => {
    const params = useQuery();
    const location = useLocation();
    const name = params.get('name');
    const { environment } = useServerContext();
    const title = 'DJ Name Generator | Cueup';
    const description = 'Find your DJ name from 19 billion possibilities.';
    const thumb =
        environment.WEBSITE_URL +
        '/sharing-previews/dj-name-generator/' +
        (name ? encodeURIComponent(name) : '');

    const pageURL = environment.WEBSITE_URL + location.pathname + location.search;

    return (
        <>
            <Helmet>
                <title>{title}</title>

                <meta name="description" content={description} />
                <meta
                    name="keywords"
                    content="dj, book, rent, copenhagen, cueup, music, events, party, wedding, birthday"
                />

                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={thumb} />
                <meta property="og:image:height" content={'630'} />
                <meta property="og:image:width" content={'1200'} />
                <meta property="og:url" content={pageURL} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@@CueupDK" />
                <meta name="twitter:creator" content="@@CueupDK" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={thumb} />
                <meta name="twitter:url" content={pageURL} />
            </Helmet>

            <App />
        </>
    );
};

export default AppWithMeta;

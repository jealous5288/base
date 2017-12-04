package net.ruixin.util.resolver;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.util.json.JacksonMapper;
import net.ruixin.util.json.JacksonUtil;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

public class MethodArgumentsJsonResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        return methodParameter.hasParameterAnnotation(FormModel.class) || methodParameter.hasParameterAnnotation(JsonModel.class) || methodParameter.hasParameterAnnotation(CollectionModel.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        Object o;
        String param;
        Class target = null;
        FormModel formModel = parameter.getParameterAnnotation(FormModel.class);
        if (null == formModel) {
            JsonModel jsonModel = parameter.getParameterAnnotation(JsonModel.class);
            if (null == jsonModel) {
                CollectionModel collectionModel = parameter.getParameterAnnotation(CollectionModel.class);
                param = collectionModel.value();
                target = collectionModel.target();
                o = new ArrayList();
            } else {
                o = new HashMap();
                param = jsonModel.value();
            }
        } else {
            o = BeanUtils.instantiate(parameter.getParameterType());
            param = formModel.value();
        }
        if ("".equals(param)) {
            param = parameter.getParameterName();
        }
        ObjectMapper mapper = JacksonMapper.getInstance();
        mapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        String jsonStr = webRequest.getParameter(param);
        Object domain = null;
        if (RxStringUtils.isNotEmpty(jsonStr)) {
            if (o instanceof Collection && target != null) {
                domain = mapper.readValue(jsonStr, getCollectionType(mapper, List.class, target));
                JsonNode jn = JacksonUtil.getJsonNode(jsonStr);
                for (int i = 0; i < jn.size(); i++) {
                    ((BaseDomain) ((List) domain).get(i)).setInteractionFields(jn.get(i));
                }
            } else {
                domain = mapper.readValue(jsonStr, o.getClass());
                if (domain != null && !(o instanceof HashMap))
                    ((BaseDomain) domain).setInteractionFields(JacksonUtil.getJsonNode(jsonStr));
            }
        }
        return domain;
    }

    private static JavaType getCollectionType(ObjectMapper mapper, Class<?> collectionClass, Class<?>... elementClasses) {
        return mapper.getTypeFactory().constructParametrizedType(collectionClass, collectionClass, elementClasses);
    }
}
